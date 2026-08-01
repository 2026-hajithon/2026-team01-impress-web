import TimerIcon from "@assets/Game/GameClock.svg";
import LeaveIcon from "@assets/Game/LeaveGame.svg";

function Header({ title, timer, onLeave }) {
  return (
    <header
      className={
        "flex w-full items-center justify-between bg-transparent px-5 py-5"
      }
    >
      <h1 className="min-w-0 truncate text-sub1-1 text-gray-200">{title}</h1>
      <div className="flex shrink-0 items-center gap-3">
        {timer !== undefined && (
          <div className="flex shrink-0 items-center gap-1.5">
            <img src={TimerIcon} />
            <span className="text-head3-2 text-main-blue">{timer}</span>
          </div>
        )}
        {onLeave && (
          <button
            type="button"
            onClick={onLeave}
            className="flex size-7 shrink-0 items-center justify-center"
            aria-label="나가기"
          >
            <img src={LeaveIcon} />
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
