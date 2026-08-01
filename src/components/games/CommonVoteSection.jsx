import ResultVoteIcon from "@assets/Result/ResultVoteIcon.svg";
import Stamp1 from "@assets/Result/Rank/Stamp1.svg";
import Stamp2 from "@assets/Result/Rank/Stamp2.svg";
import Stamp3 from "@assets/Result/Rank/Stamp3.svg";
import Stamp4 from "@assets/Result/Rank/Stamp4.svg";
import Stamp5 from "@assets/Result/Rank/Stamp5.svg";
import Stamp6 from "@assets/Result/Rank/Stamp6.svg";
import Stamp7 from "@assets/Result/Rank/Stamp7.svg";
import Stamp8 from "@assets/Result/Rank/Stamp8.svg";

// 카드 순번에 따라 도장 색이 바뀐다 (1~8번 스탬프를 순환).
const STAMPS = [Stamp1, Stamp2, Stamp3, Stamp4, Stamp5, Stamp6, Stamp7, Stamp8];

// Figma "공동질문" 섹션 — 모든 결과지 하단에 공통으로 붙는 COMMON_VOTE 요약 (282:5051 / 282:5171 공통).
const CommonVoteSection = ({ question, totalVotes = 0, topVotes = 0, stampNumber = 1 }) => {
  const stampSrc = STAMPS[(stampNumber - 1) % STAMPS.length];

  return (
    <div className="flex flex-col items-start gap-3 px-5">
      <div className="flex flex-col items-start gap-2">
        <img src={ResultVoteIcon} className="size-7" alt="" aria-hidden="true" />
        <p className="whitespace-pre-wrap text-sub1-1 text-white">{question}</p>
      </div>
      <div className="flex w-full items-end justify-between">
        <p className="text-body1-1 text-white">
          {totalVotes}표 중 <span className="text-main-pink-1">{topVotes}표</span>
        </p>
        <img src={stampSrc} className="size-25" alt={`${stampNumber}번 스탬프`} />
      </div>
    </div>
  );
};

export default CommonVoteSection;
