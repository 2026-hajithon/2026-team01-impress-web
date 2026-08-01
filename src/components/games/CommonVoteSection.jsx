import ResultVoteIcon from "@assets/Result/ResultVoteIcon.svg";
import Stamp1 from "@assets/Result/Rank/Stamp1.svg";
import Stamp2 from "@assets/Result/Rank/Stamp2.svg";
import Stamp3 from "@assets/Result/Rank/Stamp3.svg";
import Stamp4 from "@assets/Result/Rank/Stamp4.svg";
import Stamp5 from "@assets/Result/Rank/Stamp5.svg";
import Stamp6 from "@assets/Result/Rank/Stamp6.svg";
import Stamp7 from "@assets/Result/Rank/Stamp7.svg";
import Stamp8 from "@assets/Result/Rank/Stamp8.svg";

// 공통질문 득표 등수와 같은 번호의 스탬프를 표시한다.
const STAMPS = [Stamp1, Stamp2, Stamp3, Stamp4, Stamp5, Stamp6, Stamp7, Stamp8];

// Figma "공동질문" 섹션 — 모든 결과지 하단에 공통으로 붙는 COMMON_VOTE 요약 (282:5051 / 282:5171 공통).
const CommonVoteSection = ({ question, totalVotes = 0, voteCount = 0, rank }) => {
  const normalizedRank = Number(rank);
  const stampSrc = Number.isInteger(normalizedRank) && normalizedRank > 0
    ? STAMPS[Math.min(normalizedRank, STAMPS.length) - 1]
    : null;

  return (
    <div className="flex flex-col items-start gap-3 px-5">
      <div className="flex flex-col items-start gap-2">
        <img src={ResultVoteIcon} className="size-7" alt="" aria-hidden="true" />
        <p className="text-wrap-words w-full text-left text-sub1-1 text-white">{question}</p>
      </div>
      <div className="flex w-full items-end justify-between">
        <p className="text-body1-1 text-white">
          {totalVotes}표 중 <span className="text-main-pink-1">{voteCount}표</span>
        </p>
        {stampSrc && (
          <img src={stampSrc} className="size-25" alt={`${normalizedRank}등 스탬프`} />
        )}
      </div>
    </div>
  );
};

export default CommonVoteSection;
