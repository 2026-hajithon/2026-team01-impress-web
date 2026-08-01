import ChoiceGameTitle from "@components/games/ChoiceGameTitle";
import GeneralGameOptions from "@components/games/GeneralGameOptions";
import GameBackground from "./GameBackground";

const GeneralChoiceGamePage = () => {
  return (
    <GameBackground>
      <ChoiceGameTitle></ChoiceGameTitle>
      <GeneralGameOptions></GeneralGameOptions>
    </GameBackground>
  );
};

export default GeneralChoiceGamePage;
