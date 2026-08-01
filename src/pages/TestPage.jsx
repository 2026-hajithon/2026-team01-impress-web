import GeneralChoiceGamePage from "./games/GeneralChoiceGamePage";
// import PersonalAnswerGamePage from "./games/PersonalAnswerGamePage";
// import PersonalChoiceGamePage from "./games/PersonalChoiceGamePage";

const TestPage = () => {
  return (
    <div className="flex flex-col gap-5 bg-black w-full">
      {/* <PersonalAnswerGamePage></PersonalAnswerGamePage>
      <PersonalChoiceGamePage></PersonalChoiceGamePage> */}
      <GeneralChoiceGamePage></GeneralChoiceGamePage>
    </div>
  );
};

export default TestPage;
