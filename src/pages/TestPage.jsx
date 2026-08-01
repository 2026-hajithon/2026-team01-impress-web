import AnswerGameTitle from "@components/games/AnswerGameTitle";
import ChoiceGameTitle from "@components/games/ChoiceGameTitle";

const TestPage = () => {
  return (
    <div className="flex flex-col gap-5 bg-black">
      <AnswerGameTitle></AnswerGameTitle>
      <ChoiceGameTitle></ChoiceGameTitle>
    </div>
  );
};

export default TestPage;
