import PersonalOptionStar1 from "@assets/Game/Option/PersonalOptionStar1.svg";
import PersonalOptionStar2 from "@assets/Game/Option/PersonalOptionStar2.svg";
import PersonalOptionStar3 from "@assets/Game/Option/PersonalOptionStar3.svg";
import PersonalOptionStar4 from "@assets/Game/Option/PersonalOptionStar4.svg";
import PersonalOptionDot from "@assets/Game/Option/PersonalOptionDot.svg";

// Figma "개인 - 객관식 질문" 선택된 선택지(226:1718)의 그래픽을 그대로 옮긴 값.
// 각 별의 회전 중심(원본 컨테이너의 중심점)에 맞춰 배치했다.
const SelectedDecoration = () => (
  <div className="pointer-events-none absolute inset-0" aria-hidden="true">
    <img
      src={PersonalOptionStar1}
      className="absolute left-[-12.11px] top-[35.45px] w-[85.19px] rotate-[-165deg] mix-blend-screen"
    />
    <img
      src={PersonalOptionStar2}
      className="absolute left-[263.63px] top-[-39.37px] w-[103.71px] rotate-[-165deg] mix-blend-screen"
    />
    <img
      src={PersonalOptionStar3}
      className="absolute left-[63.83px] top-[24.47px] w-[19.73px] rotate-[-165deg] mix-blend-screen"
    />
    <img
      src={PersonalOptionStar4}
      className="absolute left-[246.83px] top-[80.47px] w-[19.73px] rotate-[-165deg] mix-blend-screen"
    />
    <img
      src={PersonalOptionDot}
      className="absolute left-[80px] top-[58px] size-[19px] -scale-y-100"
    />
  </div>
);

const PersonalGameOptions = ({ options = [], selected, onSelect, disabled = false }) => {
  return (
    <div className="flex w-full flex-1 flex-col gap-2.5 px-5">
      {options.map((option, idx) => {
        const isSelected = selected === option;

        return (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelect?.(option)}
            className={[
              "relative flex flex-1 items-center justify-center overflow-hidden rounded-[30px] p-5",
              "text-center text-head1-1 text-white",
              "transition-colors hover:cursor-pointer disabled:cursor-not-allowed",
              isSelected ? "bg-main-pink" : "bg-gray-950",
            ].join(" ")}
          >
            {isSelected && <SelectedDecoration />}
            <span className="relative">{option}</span>
          </button>
        );
      })}
    </div>
  );
};

export default PersonalGameOptions;
