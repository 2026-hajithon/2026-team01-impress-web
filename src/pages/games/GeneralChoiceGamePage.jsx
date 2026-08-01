import { useState } from "react";
import ChoiceGameTitle from "@components/games/ChoiceGameTitle";
import GeneralGameOptions from "@components/games/GeneralGameOptions";
import GameBackground from "./GameBackground";
import Header from "@components/Header";

const GeneralChoiceGamePage = ({
  roomName,
  timeLeft,
  question,
  participants,
  submitted,
  onSubmit,
}) => {
  const [selected, setSelected] = useState(null);
  const locked = submitted || selected !== null;

  const handleSelect = (participantId) => {
    if (locked) return;
    setSelected(participantId);
    onSubmit(participantId);
  };

  return (
    <div className="relative flex min-h-dvh flex-col">
      <GameBackground />
      <Header title={roomName} timer={timeLeft} />
      <div className="flex flex-col gap-9 pt-4 pb-8">
        <ChoiceGameTitle chipPrefix={"공통"} chipChildren={"질문"} title={question} />
        <GeneralGameOptions
          participants={participants}
          selected={selected}
          onSelect={handleSelect}
          disabled={locked}
        />
      </div>
    </div>
  );
};

export default GeneralChoiceGamePage;
