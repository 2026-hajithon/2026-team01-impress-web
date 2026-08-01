import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toPng } from "html-to-image";
import { RoomAPI } from "@apis/RoomAPI";
import { MOCK_FINAL_RESULT } from "@apis/mockData";
import GameBackground from "./GameBackground";
import GameEndPage from "./GameEndPage";
import ReportCardView from "./ReportCardView";
import { buildReportCards } from "./reportCards";
import Header from "@components/Header";
import Button from "@components/Button";

const formatDate = (date = new Date()) =>
  `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
    date.getDate(),
  ).padStart(2, "0")}`;

// Figma "게임 종료"(266:4430) -> "결과지_주관식+공동"(282:5051) / "결과지_객관식+공동"(282:5171)
const GameResultPage = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const roomName = sessionStorage.getItem("roomName") ?? "";
  const participantId = Number(sessionStorage.getItem("participantId"));

  const [phase, setPhase] = useState("ended"); // ended | loading | report
  const [cards, setCards] = useState([]);
  const [mockMode, setMockMode] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [saving, setSaving] = useState(false);

  const cardRefs = useRef([]);
  const date = useMemo(() => formatDate(), []);

  const handleViewResult = async () => {
    setPhase("loading");

    try {
      const result = await RoomAPI.getResult(roomCode, participantId);
      setCards(buildReportCards(result));
      setMockMode(false);
    } catch (error) {
      console.error(
        "%c[REST ✕] 결과지 조회 실패 — 더미 데이터로 대체합니다.",
        "color:#ff3b9b; font-weight:bold",
        error,
      );
      setCards(buildReportCards(MOCK_FINAL_RESULT));
      setMockMode(true);
    }

    setPhase("report");
  };

  const handleSaveImage = async () => {
    const node = cardRefs.current[activeIndex];
    if (!node) return;

    setSaving(true);
    try {
      const dataUrl = await toPng(node, { pixelRatio: 2, backgroundColor: "#101012" });
      const link = document.createElement("a");
      link.download = `impress-result-${activeIndex + 1}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error(
        "%c[이미지 저장 ✕] 결과지 캡처에 실패했어요.",
        "color:#ff3b9b; font-weight:bold",
        error,
      );
    } finally {
      setSaving(false);
    }
  };

  const handleBackToWaiting = () => navigate(`/rooms/${roomCode}/waiting`);

  if (phase !== "report") {
    return <GameEndPage loading={phase === "loading"} onViewResult={handleViewResult} />;
  }

  const activeCard = cards[activeIndex];

  return (
    <div className="relative flex min-h-dvh flex-col">
      <GameBackground />
      <Header title={roomName} />

      {mockMode && (
        <div className="pointer-events-none fixed right-3 top-14.5 z-50 rounded-full bg-main-pink px-2.5 py-1 text-caption1-1 text-white shadow-lg">
          MOCK
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 px-5 pt-2 pb-40">
        {cards.length > 1 && (
          <div className="flex items-center justify-center gap-2">
            {cards.map((card, index) => (
              <button
                key={card.roundId}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={[
                  "size-2 rounded-full transition-colors",
                  index === activeIndex ? "bg-main-pink-1" : "bg-gray-800",
                ].join(" ")}
                aria-label={`${index + 1}번째 결과지 보기`}
              />
            ))}
          </div>
        )}

        {cards.map((card, index) => (
          <div key={card.roundId} className={index === activeIndex ? "block" : "hidden"}>
            <ReportCardView
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              roomName={roomName}
              date={date}
              card={card}
            />
          </div>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-107.5 flex-col gap-2.5 px-5 pt-3 pb-8">
        <Button variant="pink" onClick={handleSaveImage} loading={saving} disabled={!activeCard}>
          이미지 저장
        </Button>
        <Button variant="secondary" onClick={handleBackToWaiting}>
          대기 화면으로 돌아가기
        </Button>
      </div>
    </div>
  );
};

export default GameResultPage;
