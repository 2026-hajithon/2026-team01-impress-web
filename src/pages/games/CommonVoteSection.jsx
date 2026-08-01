import ResultVoteIcon from "@assets/Result/ResultVoteIcon.svg";
import StarBurst from "@assets/Game/PersonalOptionStar1.svg";

// 카드 순번에 따라 색만 바뀌는 도장 배지. 실제 픽셀 단위 우표 그래픽(282:5171)은
// Figma MCP 호출 한도로 가져오지 못해, 기존에 있는 스타 그래픽으로 근사했다.
const STAMP_COLORS = ["bg-main-gradient", "bg-main-pink-1", "bg-main-blue"];

// Figma "공동질문" 섹션 — 모든 결과지 하단에 공통으로 붙는 COMMON_VOTE 요약 (282:5051 / 282:5171 공통).
const CommonVoteSection = ({ question, totalVotes = 0, topVotes = 0, stampNumber = 1 }) => {
  const stampClass = STAMP_COLORS[(stampNumber - 1) % STAMP_COLORS.length];

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
        <div
          className={`relative flex size-20 -rotate-[13deg] items-center justify-center rounded-full ${stampClass}`}
        >
          <img
            src={StarBurst}
            className="pointer-events-none absolute inset-0 size-full mix-blend-screen"
            alt=""
            aria-hidden="true"
          />
          <span className="relative text-head2-1 text-white">{stampNumber}</span>
        </div>
      </div>
    </div>
  );
};

export default CommonVoteSection;
