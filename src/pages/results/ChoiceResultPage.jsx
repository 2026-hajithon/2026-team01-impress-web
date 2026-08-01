import { useState } from "react";
import Chip from "@components/Chip";
import GameBackground from "@components/games/GameBackground";
import Header from "@components/Header";
import Button from "@components/Button";
import CorrectIcon from "@assets/Game/Correct.svg";
import IncorrectIcon from "@assets/Game/Incorrect.svg";
import OptionGraphic1 from "@assets/Game/Option/OptionGraphic1.svg";
import OptionGraphic2 from "@assets/Game/Option/OptionGraphic2.svg";

const BADGE_TONE = {
  pink: "bg-main-pink-1",
  blue: "bg-main-blue-1",
};

const Badge = ({ tone = "pink", children }) => (
  <div className={`flex items-center justify-center rounded-[8px] px-2 py-1 ${BADGE_TONE[tone]}`}>
    <p className="text-caption1-2 text-white">{children}</p>
  </div>
);

// Figma "개인 - 객관식 질문 결과"(283:2710 / 283:2937)
const ChoiceResultPage = ({
  roomName,
  targetName,
  question,
  optionResults = [],
  targetAnswerOptionId,
  mostSelectedOptionIds = [],
  mySelectedOptionId,
  voteUpdate,
  onNext,
  onLeave,
}) => {
  const [voted, setVoted] = useState(false);
  const sortedOptions = [...optionResults].sort((a, b) => a.displayOrder - b.displayOrder);
  const isCorrect = mySelectedOptionId !== undefined && mySelectedOptionId === targetAnswerOptionId;

  const handleNext = () => {
    setVoted(true);
    onNext();
  };

  return (
    <div className="relative flex min-h-dvh flex-col">
      <GameBackground />
      <Header title={roomName} onLeave={onLeave} />
      <div className="flex flex-1 flex-col gap-6 px-5 pt-6 pb-32">
        <div className="flex flex-col items-start gap-3">
          <Chip prefix={targetName} children={"님에 대한 질문"} />
          <p className="whitespace-pre-wrap text-head2-1 text-white">{question}</p>
        </div>

        {mySelectedOptionId !== undefined && (
          <img src={isCorrect ? CorrectIcon : IncorrectIcon} className="size-12" />
        )}

        <div className="flex flex-col gap-2.5">
          {sortedOptions.map((option) => {
            const isTrueAnswer = option.optionId === targetAnswerOptionId;
            const isMyAnswer = option.optionId === mySelectedOptionId;
            const isMostVoted = mostSelectedOptionIds.includes(option.optionId);
            // 정답이 아니면서 최다 득표거나 내가 고른 오답인 행은 파란색으로 구분한다
            // (정답=최다득표/오답=최다득표가 서로 다른 옵션일 때 둘 다 눈에 띄어야 함).
            const isHighlighted = !isTrueAnswer && (isMostVoted || isMyAnswer);
            const badgeTone = isTrueAnswer ? "pink" : "blue";

            return (
              <div
                key={option.optionId}
                className={[
                  "relative flex items-center justify-between overflow-hidden rounded-[30px] py-4 pl-5 pr-7",
                  isTrueAnswer ? "bg-main-pink" : isHighlighted ? "bg-main-blue" : "bg-gray-950",
                ].join(" ")}
              >
                {isTrueAnswer && (
                  <img
                    src={OptionGraphic1}
                    className="pointer-events-none absolute -right-2 -bottom-6 w-27.5 mix-blend-screen"
                    aria-hidden="true"
                  />
                )}
                {isHighlighted && (
                  <img
                    src={OptionGraphic2}
                    className="pointer-events-none absolute -right-3 -top-3 w-30 mix-blend-screen"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex flex-col items-start gap-1">
                  <div className="flex gap-1">
                    {isTrueAnswer && <Badge tone={badgeTone}>정답</Badge>}
                    {isMostVoted && <Badge tone={badgeTone}>최다 득표</Badge>}
                    {isMyAnswer && <Badge tone={badgeTone}>내가 고른 선택지</Badge>}
                  </div>
                  <p className="text-head3-1 text-white">{option.content}</p>
                </div>
                <p className="relative text-head2-1 text-white">{option.count}명</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto flex w-full max-w-107.5 flex-col gap-2 px-5 pt-3 pb-8">
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

export default ChoiceResultPage;
