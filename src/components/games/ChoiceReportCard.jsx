import ResultCheckIcon from "@assets/Result/ResultCheckIcon.svg";
import OptionCorrect from "@assets/Result/ResultType/OptionCorrect.svg";
import OptionMiddle from "@assets/Result/ResultType/OptionMiddle.svg";
import OptionIncorrect from "@assets/Result/ResultType/OptionIncorrect.svg";
import CorrectOptionStarLarge from "@assets/Game/Option/GeneralOptionStar1.svg";
import CorrectOptionStarSmall from "@assets/Game/Option/GeneralOptionStar2.svg";

// 정답률 3단계 (Figma 282:5171). rate = 정답자 수 / 전체 응답자 수.
const getAccuracyTierImage = (rate) => {
  if (rate >= 0.6) return OptionCorrect;
  if (rate >= 0.35) return OptionMiddle;
  return OptionIncorrect;
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
  const tierImage = getAccuracyTierImage(rate);

  return (
    <div className="flex flex-col gap-4 px-5">
      <div className="flex flex-col items-start gap-2">
        <img src={ResultCheckIcon} className="size-6" alt="" aria-hidden="true" />
        <p className="whitespace-pre-wrap text-sub1-1 text-white">{question}</p>
      </div>

      <div className="relative flex flex-col gap-1.5 overflow-hidden rounded-[20px] bg-main-gradient p-[15px]">
        <img
          src={CorrectOptionStarSmall}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-24 top-3 w-6 mix-blend-screen"
        />
        <img
          src={CorrectOptionStarLarge}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-7 -right-2 w-24 mix-blend-screen"
        />
        <p className="relative text-caption1-2 text-white/80">정답</p>
        <p className="relative text-body1-1 text-white">{trueAnswer}</p>
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

      <img src={tierImage} alt="" aria-hidden="true" className="w-full" />
    </div>
  );
};

export default ChoiceReportCard;
