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
import OnboardingPage from "@pages/onboardings/OnboardingPage";
import { runWithTransition } from "@utils/navigateWithTransition";

const formatDate = (date = new Date()) =>
  `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
    date.getDate(),
  ).padStart(2, "0")}`;

// 파일 시스템에서 쓸 수 없는 문자만 제거한다 (모임방/사람 이름은 자유 입력이라 슬래시 등이 섞일 수 있음).
const sanitizeFileNamePart = (value = "") => value.replace(/[\\/:*?"<>|]+/g, "").trim();
const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

// Figma "게임 종료"(266:4430) -> "결과지_주관식+공동"(282:5051) / "결과지_객관식+공동"(282:5171)
const GameResultPage = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const roomName = sessionStorage.getItem("roomName") ?? "";
  const participantId = Number(sessionStorage.getItem("participantId"));
  const forceMock = sessionStorage.getItem("gameMode") === "mock";

  const [phase, setPhase] = useState("ended"); // ended | loading | report
  const [cards, setCards] = useState([]);
  const [myName, setMyName] = useState("");
  const [mockMode, setMockMode] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const cardRefs = useRef([]);
  const date = useMemo(() => formatDate(), []);

  const showReport = (result, isMock) => {
    const resultCards = buildReportCards(result);
    const participantName = isMock
      ? sessionStorage.getItem("hostName") ?? result.participants?.[0]?.name ?? ""
      : result.participants?.find((participant) => participant.participantId === participantId)?.name ?? "";

    runWithTransition(() => {
      setCards(resultCards);
      setMyName(participantName);
      setMockMode(isMock);
      setActiveIndex(0);
      setPhase("report");
    });
  };

  const handleViewResult = async () => {
    setPhase("loading");
    const minimumLoadingTime = wait(3000);

    if (forceMock) {
      await minimumLoadingTime;
      showReport(MOCK_FINAL_RESULT, true);
      return;
    }

    try {
      const result = await RoomAPI.getResult(roomCode, participantId);
      await minimumLoadingTime;
      showReport(result, false);
    } catch (error) {
      console.error(
        "%c[REST ✕] 결과지 조회 실패 — 더미 데이터로 대체합니다.",
        "color:#ff3b9b; font-weight:bold",
        error,
      );
      await minimumLoadingTime;
      showReport(MOCK_FINAL_RESULT, true);
    }
  };

  const handleSelectCard = (nextIndex) => {
    if (nextIndex === activeIndex) return;

    const direction = nextIndex > activeIndex ? "card-forward" : "card-backward";
    runWithTransition(() => {
      setSaveMessage("");
      setActiveIndex(nextIndex);
    }, direction);
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
    if (phase === "loading") return <OnboardingPage />;
    return <GameEndPage loading={false} onViewResult={handleViewResult} />;
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

      <div className="flex flex-1 flex-col gap-4 px-5 pt-2 pb-52">
        {cards.length > 1 && (
          <div className="flex items-center justify-center gap-2">
            {cards.map((card, index) => (
              <button
                key={card.roundId}
                type="button"
                onClick={() => handleSelectCard(index)}
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
          <div
            key={card.roundId}
            className={index === activeIndex ? "result-card-transition block" : "hidden"}
          >
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

      <div className="result-controls-transition fixed inset-x-0 bottom-0 z-40 mx-auto flex w-full max-w-[500px] flex-col gap-2.5 bg-[linear-gradient(to_top,#101012_0%,rgba(16,16,18,0.98)_68%,rgba(16,16,18,0)_100%)] px-5 pt-14 pb-8">
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
