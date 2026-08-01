import ChoiceGameTitle from "@components/games/ChoiceGameTitle";
import GameBackground from "./GameBackground";
import PersonalGameOptions from "@components/games/PersonalGameOptions";

const PersonalChoiceGamePage = () => {
  return (
    <GameBackground>
      {/** Header */}
      <ChoiceGameTitle></ChoiceGameTitle>
      <PersonalGameOptions></PersonalGameOptions>
    </GameBackground>
  );
};

export default PersonalChoiceGamePage;
