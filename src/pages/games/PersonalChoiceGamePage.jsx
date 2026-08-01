import { useState } from "react";
import ChoiceGameTitle from "@components/games/ChoiceGameTitle";
import GameBackground from "@components/games/GameBackground";
import PersonalGameOptions from "@components/games/PersonalGameOptions";
import Header from "@components/Header";

const PersonalChoiceGamePage = ({
  roomName,
  timeLeft,
  targetName,
  question,
  options,
  submitted,
  onSubmit,
}) => {
  const [selected, setSelected] = useState(null);
  const locked = submitted || selected !== null;

  const handleSelect = (option) => {
    if (locked) return;
    setSelected(option);
    onSubmit(option);
  };

  return (
    <div className="relative flex min-h-dvh flex-col">
      <GameBackground />
      <Header title={roomName} timer={timeLeft} />
      <div className="flex flex-1 flex-col gap-8 pt-4 pb-8">
        <ChoiceGameTitle
          chipPrefix={targetName}
          chipChildren={"님에 대한 질문"}
          title={question}
        />
        <PersonalGameOptions
          options={options}
          selected={selected}
          onSelect={handleSelect}
          disabled={locked}
        />
        <p className="text-center text-body1-2 text-gray-50">
          한번 선택하면 바꿀 수 없어요
        </p>
      </div>
    </div>
  );
};

export default PersonalChoiceGamePage;
