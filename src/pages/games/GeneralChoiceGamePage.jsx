import ChoiceGameTitle from "@components/games/ChoiceGameTitle";
import GeneralGameOptions from "@components/games/GeneralGameOptions";
import GameBackground from "./GameBackground";
import Header from "@components/Header";

const GeneralChoiceGamePage = () => {
  return (
    <div className="relative min-h-dvh">
      <GameBackground />
      <Header title={"팀 이름"} timer></Header>
      <div className="flex flex-col gap-8">
        <ChoiceGameTitle></ChoiceGameTitle>
        <GeneralGameOptions></GeneralGameOptions>
      </div>
    </div>
  );
};

export default GeneralChoiceGamePage;
