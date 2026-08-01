import { useState } from "react";
import Chip from "@components/Chip";
import GameBackground from "@components/games/GameBackground";
import Header from "@components/Header";
import Button from "@components/Button";

const splitQuestion = (question = "") => {
  const [prefixText, suffixText = ""] = question.split(/_+/);
  return { prefixText, suffixText };
};

// Figma "개인 - 주관식 질문 결과"(226:1655)
const AnswerResultPage = ({
  roomName,
  targetName,
  question,
  answers = [],
  voteUpdate,
  onNext,
}) => {
  const [voted, setVoted] = useState(false);
  const { prefixText, suffixText } = splitQuestion(question);

  const handleNext = () => {
    setVoted(true);
    onNext();
  };

  return (
    <div className="relative flex min-h-dvh flex-col">
      <GameBackground />
      <Header title={roomName} />
      <div className="flex flex-1 flex-col gap-10 px-5 pt-6 pb-32">
        <div className="flex flex-col items-start gap-3">
          <Chip prefix={targetName} children={"님에 대한 질문"} />
          <p className="text-head2-1 text-white">
            {prefixText}
            <br />
            <span className="whitespace-pre">{`(                                  )`}</span>
            <br />
            {suffixText}
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <p className="px-2.5 text-body1-2 text-gray-400">답변결과</p>
          {answers.map((answer) => (
            <div
              key={answer.submitterId}
              className="flex flex-col gap-1.5 rounded-[20px] bg-gray-950 p-[15px]"
            >
              <p className="text-body2-2 text-gray-500">{answer.submitterName}</p>
              <p className="text-body1-1 text-white">
                {prefixText}
                <span className="text-main-blue-1">{answer.textAnswer}</span>
                {suffixText}
              </p>
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

export default AnswerResultPage;
