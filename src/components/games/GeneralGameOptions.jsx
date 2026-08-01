import GeneralOptionStar1 from "@assets/Game/GeneralOptionStar1.svg";
import GeneralOptionStar2 from "@assets/Game/GeneralOptionStar2.svg";
import GeneralOptionDotSmall from "@assets/Game/GeneralOptionDotSmall.svg";
import GeneralOptionDotBig from "@assets/Game/GeneralOptionDotBig.svg";

// Figma "공동 질문" 선택된 참가자 칸(226:1845)의 그래픽을 그대로 옮긴 값.
const SelectedDecoration = () => (
  <div className="pointer-events-none absolute inset-0" aria-hidden="true">
    <img
      src={GeneralOptionStar1}
      className="absolute left-[-30.94px] top-[51.02px] w-[88.86px] rotate-[-165deg] mix-blend-screen"
    />
    <img
      src={GeneralOptionStar2}
      className="absolute left-[126.83px] top-[66.47px] w-[19.73px] rotate-[-165deg] mix-blend-screen"
    />
    <img
      src={GeneralOptionDotSmall}
      className="absolute left-[22px] top-[31px] size-[19px] -scale-y-100"
    />
    <img src={GeneralOptionDotBig} className="absolute left-[124px] top-[-7px] size-[57px]" />
  </div>
);

const GameOption = ({ name, onClick, isSelected, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "relative flex h-28.5 w-full items-center justify-center overflow-hidden rounded-[20px]",
        "text-center text-head2-2 text-white",
        "transition-colors hover:cursor-pointer disabled:cursor-not-allowed",
        isSelected ? "bg-main-pink" : "bg-gray-950",
      ].join(" ")}
    >
      {isSelected && <SelectedDecoration />}
      <span className="relative">{name}</span>
    </button>
  );
};

const GeneralGameOptions = ({ participants = [], selected, onSelect, disabled = false }) => {
  return (
    <div className="grid w-full grid-cols-2 gap-3 px-5">
      {participants.map((participant) => (
        <GameOption
          key={participant.participantId}
          name={participant.name}
          isSelected={selected === participant.participantId}
          disabled={disabled}
          onClick={() => onSelect?.(participant.participantId)}
        ></GameOption>
      ))}
    </div>
  );
};

export default GeneralGameOptions;
