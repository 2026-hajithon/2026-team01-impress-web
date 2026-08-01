const GameOption = (name, idx) => {
  return (
    <div
      className="w-full h-28.5 rounded-[20px] bg-gray-950 text-white"
      key={idx}
    >
      {name}
    </div>
  );
};

const GeneralGameOptions = (/*participantList*/) => {
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
  return (
    <div className="flex">
      {PARTICIPANT_LIST.map((participant, idx) => {
        return <GameOption name={participant.name} key={idx}></GameOption>;
      })}
    </div>
  );
};

export default GeneralGameOptions;
