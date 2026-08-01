import { forwardRef } from "react";
import ResultLogo from "@assets/Result/ResultLogo.svg";
import ResultFooterMark from "@assets/Result/ResultFooterMark.svg";
import BackgroundGlow from "@assets/Background/BackgroundGraphic0.svg";

const Divider = () => <div className="w-full border-t border-dashed border-gray-800" />;

const InfoRow = ({ label, value }) => (
  <div className="flex w-full items-center gap-3">
    <p className="w-12.5 shrink-0 text-body2-2 text-gray-500">{label}</p>
    <p className="min-w-0 flex-1 truncate text-body2-1 text-white">{value}</p>
  </div>
);

// Figma "결과지_주관식+공동"(282:5051) / "결과지_객관식+공동"(282:5171) 공통 카드 셸.
// 캡처(html-to-image)를 위해 ref를 그대로 카드 루트 DOM에 꽂는다.
const ResultCard = forwardRef(({ roomName, participantName, date, children }, ref) => (
  <div ref={ref} className="relative w-full overflow-hidden rounded-[30px] bg-black">
    <img
      src={BackgroundGlow}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute bottom-[-140px] left-1/2 w-[900px] max-w-none -translate-x-1/2"
    />
    <div className="relative flex flex-col gap-8 pb-8">
      <div className="flex items-center justify-center py-5">
        <img src={ResultLogo} alt="Im Press." className="h-13" />
      </div>

      <div className="flex flex-col gap-4 px-5">
        <Divider />
        <div className="flex flex-col gap-1.5">
          <InfoRow label="모임방" value={roomName} />
          <InfoRow label="이름" value={participantName} />
          <InfoRow label="날짜" value={date} />
        </div>
        <Divider />
      </div>

      {children}

      <div className="flex flex-col items-center gap-6 px-5">
        <Divider />
        <img src={ResultFooterMark} alt="" aria-hidden="true" className="h-10" />
      </div>
    </div>
  </div>
));

ResultCard.displayName = "ResultCard";

export default ResultCard;
