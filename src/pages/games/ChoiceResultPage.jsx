import { useState } from "react";
import Chip from "@components/Chip";
import GameBackground from "./GameBackground";
import Header from "@components/Header";
import Button from "@components/Button";
import CorrectIcon from "@assets/Game/Correct.svg";
import IncorrectIcon from "@assets/Game/Incorrect.svg";
import PersonalOptionStar1 from "@assets/Game/PersonalOptionStar1.svg";

const Badge = ({ children }) => (
  <div className="flex items-center justify-center rounded-[8px] bg-main-pink-1 px-2 py-1">
    <p className="text-caption1-2 text-white">{children}</p>
  </div>
);

// Figma "개인 - 객관식 질문 결과"(283:2710 / 283:2937)
const ChoiceResultPage = ({
  roomName,
  targetName,
  question,
  options = [],
  counts = {},
  trueAnswer,
  myAnswer,
  voteUpdate,
  onNext,
}) => {
  const [voted, setVoted] = useState(false);
  const maxCount = Math.max(0, ...options.map((option) => counts[option] ?? 0));
  const isCorrect = myAnswer !== undefined && myAnswer === trueAnswer;

  const handleNext = () => {
    setVoted(true);
    onNext();
  };

  return (
    <div className="relative flex min-h-dvh flex-col">
      <GameBackground />
      <Header title={roomName} />
      <div className="flex flex-1 flex-col gap-6 px-5 pt-6 pb-32">
        <div className="flex flex-col items-start gap-3">
          <Chip prefix={targetName} children={"님에 대한 질문"} />
          <p className="whitespace-pre-wrap text-head2-1 text-white">{question}</p>
        </div>

        {myAnswer !== undefined && (
          <img src={isCorrect ? CorrectIcon : IncorrectIcon} className="size-12" />
        )}

        <div className="flex flex-col gap-2.5">
          {options.map((option) => {
            const count = counts[option] ?? 0;
            const isTrueAnswer = option === trueAnswer;
            const isMyAnswer = option === myAnswer;
            const isMostVoted = count === maxCount && maxCount > 0;

            return (
              <div
                key={option}
                className={[
                  "relative flex items-center justify-between overflow-hidden rounded-[30px] py-4 pl-5 pr-7",
                  isTrueAnswer ? "bg-main-pink" : "bg-gray-950",
                ].join(" ")}
              >
                {isTrueAnswer && (
                  <img
                    src={PersonalOptionStar1}
                    className="pointer-events-none absolute left-[219px] top-[9px] w-[155px] rotate-[-165deg] mix-blend-screen"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex flex-col items-start gap-1">
                  <div className="flex gap-1">
                    {isTrueAnswer && <Badge>정답</Badge>}
                    {isTrueAnswer && isMostVoted && <Badge>최다 득표</Badge>}
                    {isMyAnswer && <Badge>내가 고른 선택지</Badge>}
                  </div>
                  <p className="text-head3-1 text-white">{option}</p>
                </div>
                <p className="relative text-head2-1 text-white">{count}명</p>
              </div>
            );
          })}
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

export default ChoiceResultPage;
