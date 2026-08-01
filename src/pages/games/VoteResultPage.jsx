import { useState } from "react";
import Chip from "@components/Chip";
import GameBackground from "./GameBackground";
import Header from "@components/Header";
import Button from "@components/Button";

const rankBadgeClass = (idx, isLast) => {
  if (idx === 0) return "bg-main-gradient";
  if (isLast) return "bg-gray-500";
  if (idx === 1) return "bg-main-pink";
  if (idx === 2) return "bg-main-pink-1";
  return "bg-main-blue";
};

// Figma "공동질문 결과"(226:1763)
const VoteResultPage = ({ roomName, question, ranking = [], voteUpdate, onNext }) => {
  const [voted, setVoted] = useState(false);

  const handleNext = () => {
    setVoted(true);
    onNext();
  };

  return (
    <div className="relative flex min-h-dvh flex-col">
      <GameBackground />
      <Header title={roomName} />
      <div className="flex flex-1 flex-col gap-8 px-5 pt-6 pb-32">
        <div className="flex flex-col items-start gap-3">
          <Chip prefix={"공통"} children={"질문"} />
          <p className="whitespace-pre-wrap text-head2-1 text-white">{question}</p>
        </div>

        <div className="flex flex-col gap-5">
          {ranking.map((entry, idx) => (
            <div key={entry.participantId} className="flex items-center gap-5">
              <div
                className={[
                  "flex size-11.25 shrink-0 -rotate-[13.44deg] items-center justify-center rounded-full",
                  "text-head3-1 text-white",
                  rankBadgeClass(idx, idx === ranking.length - 1),
                ].join(" ")}
              >
                {idx + 1}
              </div>
              <div className="flex flex-1 items-center justify-between">
                <p className="text-sub1-1 text-white">{entry.name}</p>
                <p className="text-sub1-1 text-white">{entry.votes}표</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-107.5 px-5 pt-3 pb-8">
        <Button onClick={handleNext} disabled={voted}>
          {voted
            ? `${voteUpdate?.votedCount ?? 0}/${voteUpdate?.requiredCount ?? "?"} 대기 중`
            : "다음으로"}
        </Button>
      </div>
    </div>
  );
};

export default VoteResultPage;
