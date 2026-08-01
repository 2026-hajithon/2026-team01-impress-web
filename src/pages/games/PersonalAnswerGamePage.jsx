import { useState } from "react";
import AnswerGameTitle from "@components/games/AnswerGameTitle";
import GameBackground from "./GameBackground";
import Header from "@components/Header";
import Button from "@components/Button";

const splitQuestion = (question = "") => {
  const [prefixText, suffixText = ""] = question.split(/_+/);
  return { prefixText, suffixText };
};

const PersonalAnswerGamePage = ({
  roomName,
  timeLeft,
  targetName,
  question,
  submitted,
  onSubmit,
}) => {
  const [value, setValue] = useState("");
  const { prefixText, suffixText } = splitQuestion(question);

  const handleSubmit = () => {
    if (submitted || !value.trim()) return;
    onSubmit(value.trim());
  };

  return (
    <div className="relative flex min-h-dvh flex-col">
      <GameBackground />
      <Header title={roomName} timer={timeLeft} />
      <div className="flex flex-1 flex-col justify-between gap-8 pt-4 pb-8">
        <AnswerGameTitle
          chipPrefix={targetName}
          chipChildren={"님에 대한 질문"}
          prefixText={prefixText}
          suffixText={suffixText}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={submitted}
        />
        <div className="px-5">
          <Button onClick={handleSubmit} disabled={submitted || !value.trim()}>
            {submitted ? "제출 완료" : "제출하기"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PersonalAnswerGamePage;
