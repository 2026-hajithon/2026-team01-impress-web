import ChoiceGameTitle from "@components/games/ChoiceGameTitle";
import GeneralGameOptions from "@components/games/GeneralGameOptions";
import GameBackground from "./GameBackground";
import Header from "@components/Header";

const GeneralChoiceGamePage = () => {
  // 헤더에 들어갈 게임 정보 호출

  // 문제 정보 호출

  return (
    <div className="relative min-h-dvh">
      <GameBackground />
      <Header title={"팀 이름"} timer={"60"}></Header>
      <div className="flex flex-col gap-8">
        <ChoiceGameTitle
          chipPrefix={"이혁"}
          chipChildren={"님에 대한 질문"}
          title={`어렸을 때, 가장 엄마 말을\n안 들었을 것 같은 사람은?`}
        ></ChoiceGameTitle>
        <GeneralGameOptions></GeneralGameOptions>
      </div>
    </div>
  );
};

export default GeneralChoiceGamePage;
