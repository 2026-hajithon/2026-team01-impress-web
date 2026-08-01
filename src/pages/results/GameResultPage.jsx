import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toPng } from "html-to-image";
import { RoomAPI } from "@apis/RoomAPI";
import { MOCK_FINAL_RESULT } from "@apis/mockData";
import GameBackground from "@components/games/GameBackground";
import GameEndPage from "./GameEndPage";
import ReportCardView from "@components/games/ReportCardView";
import { buildReportCards } from "@utils/reportCards";
import Header from "@components/Header";
import Button from "@components/Button";

const formatDate = (date = new Date()) =>
  `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
    date.getDate(),
  ).padStart(2, "0")}`;

// 파일 시스템에서 쓸 수 없는 문자만 제거한다 (모임방/사람 이름은 자유 입력이라 슬래시 등이 섞일 수 있음).
const sanitizeFileNamePart = (value = "") => value.replace(/[\\/:*?"<>|]+/g, "").trim();

// Figma "게임 종료"(266:4430) -> "결과지_주관식+공동"(282:5051) / "결과지_객관식+공동"(282:5171)
const GameResultPage = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const roomName = sessionStorage.getItem("roomName") ?? "";
  const participantId = Number(sessionStorage.getItem("participantId"));

  const [phase, setPhase] = useState("ended"); // ended | loading | report
  const [cards, setCards] = useState([]);
  const [myName, setMyName] = useState("");
  const [mockMode, setMockMode] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const cardRefs = useRef([]);
  const date = useMemo(() => formatDate(), []);

  const handleViewResult = async () => {
    setPhase("loading");

    try {
      const result = await RoomAPI.getResult(roomCode, participantId);
      setCards(buildReportCards(result));
      setMyName(result.participants?.find((p) => p.participantId === participantId)?.name ?? "");
      setMockMode(false);
    } catch (error) {
      console.error(
        "%c[REST ✕] 결과지 조회 실패 — 더미 데이터로 대체합니다.",
        "color:#ff3b9b; font-weight:bold",
        error,
      );
      setCards(buildReportCards(MOCK_FINAL_RESULT));
      setMyName(
        MOCK_FINAL_RESULT.participants.find((p) => p.participantId === participantId)?.name ??
          MOCK_FINAL_RESULT.participants[0]?.name ??
          "",
      );
      setMockMode(true);
    }

    setPhase("report");
  };

  const handleSaveImage = async () => {
    const node = cardRefs.current[activeIndex];
    if (!node) return;

    setSaving(true);
    setSaveMessage("");
    try {
      const dataUrl = await toPng(node, { pixelRatio: 2, backgroundColor: "#101012" });
      const fileName = [roomName, myName, date]
        .map(sanitizeFileNamePart)
        .filter(Boolean)
        .join("-");

      const imageBlob = await fetch(dataUrl).then((response) => response.blob());
      if (imageBlob.type !== "image/png" || imageBlob.size === 0) {
        throw new Error("생성된 PNG 이미지가 비어 있거나 형식이 올바르지 않습니다.");
      }

      const imageUrl = URL.createObjectURL(imageBlob);
      const link = document.createElement("a");
      link.download = `${fileName || `impress-result-${activeIndex + 1}`}.png`;
      link.href = imageUrl;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(imageUrl), 0);
      setSaveMessage("이미지를 저장했어요.");
    } catch (error) {
      console.error(
        "%c[이미지 저장 ✕] 결과지 캡처에 실패했어요.",
        "color:#ff3b9b; font-weight:bold",
        error,
      );
      setSaveMessage("이미지 저장에 실패했어요. 다시 시도해주세요.");
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
        {saveMessage && (
          <p className="text-center text-caption1-2 text-main-pink-1" aria-live="polite">
            {saveMessage}
          </p>
        )}
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
