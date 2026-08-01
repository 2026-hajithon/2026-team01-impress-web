import ResultAnswerIcon from "@assets/Result/ResultAnswerIcon.svg";

const splitQuestion = (question = "") => {
  const [prefixText, suffixText = ""] = question.split(/_+/);
  return { prefixText, suffixText };
};

// Figma "결과지_주관식+공동"(282:5051)의 주관식(BLANK) 콘텐츠 영역.
const AnswerReportCard = ({ question, answers = [] }) => {
  const { prefixText, suffixText } = splitQuestion(question);

  return (
    <div className="flex flex-col gap-4 px-5">
      <div className="flex flex-col items-start gap-2">
        <img src={ResultAnswerIcon} className="size-6" alt="" aria-hidden="true" />
        <p className="text-wrap-words w-full text-left text-sub1-1 text-white">
          {prefixText}
          <br />
          <span className="whitespace-pre">{`(                                  )`}</span>
          <br />
          {suffixText}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {answers.map((answer) => (
          <div
            key={answer.submitterId}
            className="flex flex-col gap-1.5 rounded-[20px] bg-gray-950 p-[15px]"
          >
            <p className="text-wrap-words text-left text-caption1-2 text-gray-500">
              {answer.submitterName}
            </p>
            <p className="text-wrap-words text-left text-body2-2 text-white">
              {prefixText}
              <span className="text-main-blue-1">{answer.textAnswer}</span>
              {suffixText}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnswerReportCard;
