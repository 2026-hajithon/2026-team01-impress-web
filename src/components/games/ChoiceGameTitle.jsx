import Chip from "@components/Chip";

const ChoiceGameTitle = () => {
  return (
    <div className="flex flex-col gap-9 w-full items-center">
      <div>
        <Chip size="large" prefix={"이혁"} children={"님에 대한 질문"}></Chip>
      </div>

      <div className="flex flex-col gap-4 w-full items-center">
        <div className="text-white text-head1-1">질문이 있다고 할 때</div>
      </div>
    </div>
  );
};

export default ChoiceGameTitle;
