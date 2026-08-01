import CorrectIcon from "@assets/Game/Correct.svg";

// 정답률 3단계 (Figma 282:5171, MCP 호출 한도로 정확한 마스코트 일러스트는 가져오지 못해
// 말풍선 텍스트 + 톤 컬러로 근사했다). rate = 정답자 수 / 전체 응답자 수.
const getAccuracyTier = (rate) => {
  if (rate >= 0.6) {
    return {
      tone: "text-main-blue-1",
      message: "많은 사람들이 정답을 맞혔어요!\n이미지와 실제가 비슷한 당신은 투명한 사람!",
    };
  }
  if (rate >= 0.35) {
    return {
      tone: "text-main-pink-1",
      message: "정답자와 오답자가 반반이에요!\n당신은 두 가지 이미지를 가지고 있나봐요",
    };
  }
  return {
    tone: "text-main-pink",
    message: "많은 사람들이 정답을 맞추지 못했어요!\n당신의 반전매력을 발견했어요!",
  };
};

// Figma "결과지_객관식+공동"(282:5171)의 객관식(INDIVIDUAL_OX) 콘텐츠 영역.
const ChoiceReportCard = ({
  question,
  trueAnswer,
  mostVotedOption,
  mostVotedCount,
  totalVotes,
  correctCount = 0,
  totalCount = 0,
}) => {
  const rate = totalCount > 0 ? correctCount / totalCount : 0;
  const tier = getAccuracyTier(rate);

  return (
    <div className="flex flex-col gap-4 px-5">
      <div className="flex flex-col items-start gap-2">
        <img src={CorrectIcon} className="size-6" alt="" aria-hidden="true" />
        <p className="whitespace-pre-wrap text-sub1-1 text-white">{question}</p>
      </div>

      <div className="flex flex-col gap-1.5 rounded-[20px] bg-main-gradient p-[15px]">
        <p className="text-caption1-2 text-white/80">정답</p>
        <p className="text-body1-1 text-white">{trueAnswer}</p>
      </div>

      {mostVotedOption !== undefined && (
        <div className="flex flex-col gap-1.5 rounded-[20px] bg-gray-950 p-[15px]">
          <p className="text-caption1-2 text-gray-500">가장 많은 선택을 받은 이미지</p>
          <div className="flex items-end justify-between">
            <p className="text-body1-1 text-white">{mostVotedOption}</p>
            <p className="text-body2-2 text-gray-300">
              {totalVotes}표 중 <span className="text-main-pink-1">{mostVotedCount}표</span>
            </p>
          </div>
        </div>
      )}

      <p
        className={`whitespace-pre-wrap rounded-[20px] bg-gray-950 p-[15px] text-body2-2 ${tier.tone}`}
      >
        {tier.message}
      </p>
    </div>
  );
};

export default ChoiceReportCard;
