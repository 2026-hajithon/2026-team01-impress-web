import TimerIcon from "@assets/Game/GameClock.svg";

function Header({ title, timer }) {
  return (
    <header
      className={
        "flex w-full items-center justify-between bg-transparent px-5 py-5"
      }
    >
      <h1 className="text-sub1-1 text-gray-200">{title}</h1>
      {timer !== undefined && (
        <div className="flex shrink-0 items-center gap-1.5">
          <img src={TimerIcon} />
          <span className="text-head3-2 text-main-blue">{timer}</span>
        </div>
      )}
    </header>
  );
}

export default Header;
