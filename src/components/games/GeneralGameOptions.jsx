const GameOption = ({ name, idx }) => {
  return (
    <div
      className="w-full h-28.5 rounded-[20px] bg-gray-950 text-white text-head2-2 content-center text-center"
      key={idx}
    >
      {name}
    </div>
  );
};

const PARTICIPANT_LIST = [
  { name: "이혁" },
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
        return <GameOption name={participant.name} key={idx}></GameOption>;
      })}
    </div>
  );
};

export default GeneralGameOptions;
