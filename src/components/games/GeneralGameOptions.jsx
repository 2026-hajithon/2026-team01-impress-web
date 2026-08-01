import OptionGraphic1 from "@assets/Game/OptionGraphic1.svg";
import OptionGraphic2 from "@assets/Game/OptionGraphic2.svg";
import OptionGraphic3 from "@assets/Game/OptionGraphic3.svg";
import OptionGraphic4 from "@assets/Game/OptionGraphic4.svg";
import OptionGraphic5 from "@assets/Game/OptionGraphic5.svg";

const GameOption = ({ name, idx, onClick, isSelected }) => {
  // 그래픽 위치 조정 필요함
  return (
    <>
      {isSelected ? (
        <div
          className="w-full h-28.5 rounded-[20px]
       bg-main-pink text-white text-head2-2 content-center text-center hover:cursor-pointer overflow-hidden"
          key={idx}
          onClick={onClick}
        >
          <div className="relative">
            <img src={OptionGraphic1} className="absolute"></img>
            <img src={OptionGraphic2} className="absolute"></img>
            <img src={OptionGraphic3} className="absolute"></img>
            <img src={OptionGraphic4} className="absolute"></img>
            <img src={OptionGraphic5} className="absolute"></img>
          </div>
          {name}
        </div>
      ) : (
        <div
          className="w-full h-28.5 rounded-[20px]
       bg-gray-950 text-white text-head2-2 content-center text-center hover:cursor-pointer"
          key={idx}
          onClick={onClick}
        >
          {name}
        </div>
      )}
    </>
  );
};

const PARTICIPANT_LIST = [
  { name: "이혁", isSelected: true },
  { name: "이혁" },
  { name: "이혁" },
  { name: "이혁" },
  { name: "이혁" },
  { name: "이혁" },
  { name: "이혁" },
  { name: "이혁" },
];

const GeneralGameOptions = (/*participantList*/) => {
  return (
    <div className="grid w-full grid-cols-2 px-5 gap-3">
      {PARTICIPANT_LIST.map((participant, idx) => {
        return (
          <GameOption
            name={participant.name}
            key={idx}
            isSelected={participant.isSelected}
          ></GameOption>
        );
      })}
    </div>
  );
};

export default GeneralGameOptions;
