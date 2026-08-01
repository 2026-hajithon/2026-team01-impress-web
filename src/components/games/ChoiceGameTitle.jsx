import Chip from "@components/Chip";

const ChoiceGameTitle = ({ chipPrefix, chipChildren, title }) => {
  return (
    <div className="flex flex-col gap-5 w-full items-center">
      <div>
        <Chip size="large" prefix={chipPrefix} children={chipChildren}></Chip>
      </div>
      <div className="flex flex-col gap-4 w-full items-center px-5">
        <p className="text-wrap-words w-full text-center text-head1-1 text-white">
          {title}
        </p>
      </div>
    </div>
  );
};

export default ChoiceGameTitle;
