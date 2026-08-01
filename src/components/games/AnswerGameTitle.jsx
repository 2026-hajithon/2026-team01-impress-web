import Chip from "@components/Chip";

const AnswerGameTitle = ({
  chipPrefix,
  chipChildren,
  prefixText,
  suffixText,
  value,
  onChange,
  disabled = false,
  placeholder = "이미지를 상상해서 입력하세요",
}) => {
  return (
    <div className="flex w-full flex-col items-center gap-9">
      <Chip size="large" prefix={chipPrefix} children={chipChildren}></Chip>
      <div className="flex w-full flex-col items-center gap-4 px-5">
        <div className="text-wrap-words w-full text-center text-head1-1 text-white">
          {prefixText}
        </div>
        <input
          type="text"
          value={value}
          onChange={onChange}
          disabled={disabled}
          maxLength={30}
          className="w-full rounded-[20px] bg-gray-950 py-[15.5px] text-center text-head3-2 text-main-blue placeholder:text-gray-700 focus:outline-none disabled:opacity-60"
          placeholder={placeholder}
        />
        <div className="text-wrap-words w-full text-center text-head1-1 text-white">
          {suffixText}
        </div>
      </div>
    </div>
  );
};

export default AnswerGameTitle;
