import ChoiceGameTitle from "@components/games/ChoiceGameTitle";
import GeneralGameOptions from "@components/games/GeneralGameOptions";
import GameBackground from "./GameBackground";

const GeneralChoiceGamePage = () => {
  return (
    <>
      <GameBackground />
      {/** Header */}
      <div className="flex flex-col gap-8">
        <ChoiceGameTitle></ChoiceGameTitle>
        <GeneralGameOptions></GeneralGameOptions>
      </div>
    </>
  );
};

export default GeneralChoiceGamePage;
