import { useState } from "react";
import Chip from "@components/Chip";
import GameBackground from "@components/games/GameBackground";
import Header from "@components/Header";
import Button from "@components/Button";
import Rank1 from "@assets/Game/Rank/Rank1.svg";
import Rank2 from "@assets/Game/Rank/Rank2.svg";
import Rank3 from "@assets/Game/Rank/Rank3.svg";
import Rank4 from "@assets/Game/Rank/Rank4.svg";
import Rank5 from "@assets/Game/Rank/Rank5.svg";
import Rank6 from "@assets/Game/Rank/Rank6.svg";
import Rank7 from "@assets/Game/Rank/Rank7.svg";
import Rank8 from "@assets/Game/Rank/Rank8.svg";
import { resolveVoteRank } from "@utils/reportCards";

const RANK_IMAGES = [Rank1, Rank2, Rank3, Rank4, Rank5, Rank6, Rank7, Rank8];

// Figma "공동질문 결과"(226:1763)
const VoteResultPage = ({ roomName, question, votes = [], voteUpdate, onNext, onLeave }) => {
  const [voted, setVoted] = useState(false);

  const handleNext = () => {
    setVoted(true);
    onNext();
  };

  return (
    <div className="relative flex min-h-dvh flex-col">
      <GameBackground />
      <Header title={roomName} onLeave={onLeave} />
      <div className="flex flex-1 flex-col gap-8 px-5 pt-6 pb-32">
        <div className="flex flex-col items-start gap-3">
          <Chip prefix={"공통"} children={"질문"} />
          <p className="text-wrap-words w-full text-left text-head2-1 text-white">{question}</p>
        </div>

        <div className="flex flex-col gap-5">
          {votes.map((entry) => {
            const rank = resolveVoteRank(votes, entry.participantId, entry.participantName);
            const rankImage = RANK_IMAGES[Math.min(rank, RANK_IMAGES.length) - 1];

            return (
              <div key={entry.participantId} className="flex items-center gap-5">
                <img src={rankImage} alt={`${rank}등`} className="size-11.25 shrink-0" />
                <div className="flex flex-1 items-center justify-between">
                  <p className="text-sub1-1 text-white">{entry.participantName}</p>
                  <p className="text-sub1-1 text-white">{entry.count}표</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-[500px] flex-col gap-2 px-5 pt-3 pb-8">
        {voted && (
          <p className="text-center text-caption1-2 text-main-pink-1">
            *과반수가 참여할 때까지 잠시만 기다려주세요.
          </p>
        )}
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
