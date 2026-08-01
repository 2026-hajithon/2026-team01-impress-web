import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toPng } from "html-to-image";
import Button from "@components/Button";
import GameBackground from "@components/games/GameBackground";
import Header from "@components/Header";
import ReportCardView from "@components/games/ReportCardView";
import { buildReportCards } from "@utils/reportCards";
import { useFrontendTest } from "../FrontendTestContext";
import { createFinalResult } from "../testSession";

const formatDate = () => {
  const date = new Date();
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
    date.getDate(),
  ).padStart(2, "0")}`;
};

const FrontendTestReportPage = () => {
  const navigate = useNavigate();
  const { session, getAnswers, resetSession } = useFrontendTest();
  const [answers] = useState(getAnswers);
  const [activeIndex, setActiveIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const refs = useRef([]);
  const date = useMemo(() => formatDate(), []);
  const cards = useMemo(
    () => buildReportCards(createFinalResult(session, answers)),
    [answers, session],
  );

  const handleSave = async () => {
    const node = refs.current[activeIndex];
    if (!node) return;

    setSaving(true);
    setMessage("");
    try {
      const dataUrl = await toPng(node, { pixelRatio: 2, backgroundColor: "#101012" });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `frontend-test-result-${activeIndex + 1}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessage("테스트 결과 이미지를 저장했어요.");
    } catch (error) {
      console.error("[Frontend Test] 이미지 저장 실패", error);
      setMessage("이미지 저장에 실패했어요.");
    } finally {
      setSaving(false);
    }
  };

  const handleRestart = () => {
    resetSession();
    navigate("/", { replace: true });
  };

  return (
    <div className="relative flex min-h-dvh flex-col">
      <GameBackground />
      <Header title={session.roomName} />
      <div className="fixed right-3 top-14.5 z-50 rounded-full bg-main-blue px-2.5 py-1 text-caption1-1 text-white">
        FRONT TEST
      </div>

      <div className="relative flex flex-1 flex-col gap-4 px-5 pb-40 pt-2">
        <div className="flex items-center justify-center gap-2">
          {cards.map((card, index) => (
            <button
              key={card.roundId}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={[
                "size-2 rounded-full",
                index === activeIndex ? "bg-main-pink-1" : "bg-gray-800",
              ].join(" ")}
              aria-label={`${index + 1}번째 결과지 보기`}
            />
          ))}
        </div>

        {cards.map((card, index) => (
          <div key={card.roundId} className={index === activeIndex ? "block" : "hidden"}>
            <ReportCardView
              ref={(node) => {
                refs.current[index] = node;
              }}
              roomName={session.roomName}
              date={date}
              card={card}
            />
          </div>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-107.5 flex-col gap-2 px-5 pb-8 pt-3">
        {message && <p className="text-center text-caption1-2 text-main-pink-1">{message}</p>}
        <Button variant="pink" onClick={handleSave} loading={saving}>이미지 저장 테스트</Button>
        <Button variant="secondary" onClick={handleRestart}>처음부터 다시 테스트</Button>
      </div>
    </div>
  );
};

export default FrontendTestReportPage;
