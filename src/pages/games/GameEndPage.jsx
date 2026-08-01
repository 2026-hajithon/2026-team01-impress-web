import GameBackground from "./GameBackground";
import Button from "@components/Button";
import TimesUpIcon from "@assets/Game/GameTimesUp.svg";

// Figma "게임 종료"(266:4430)
const GameEndPage = ({ loading, onViewResult }) => (
  <div className="relative flex min-h-dvh flex-col">
    <GameBackground />
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <img src={TimesUpIcon} className="w-32" alt="" aria-hidden="true" />
      <p className="text-head1-1 text-white">Times up!</p>
    </div>
    <div className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-107.5 px-5 pt-3 pb-8">
      <Button onClick={onViewResult} loading={loading}>
        결과지 보러가기
      </Button>
    </div>
  </div>
);

export default GameEndPage;
