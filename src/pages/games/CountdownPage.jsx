import { useEffect, useState } from "react";
import GameBackground from "@components/games/GameBackground";
import CountDown3 from "@assets/Game/CountDown/CountDown3.svg";
import CountDown2 from "@assets/Game/CountDown/CountDown2.svg";
import CountDown1 from "@assets/Game/CountDown/CountDown1.svg";
import GameStartIcon from "@assets/Game/GameStart.svg";

const STEPS = [
  { key: "3", image: CountDown3, duration: 1000 },
  { key: "2", image: CountDown2, duration: 1000 },
  { key: "1", image: CountDown1, duration: 1000 },
  { key: "start", duration: 1200 },
];

// 카운트다운(3 -> 2 -> 1 -> Game Start). 시간에 맞춰 내부적으로 스텝을 전환하고,
// 마지막 스텝이 끝나면 onComplete를 호출해 실제 게임 화면으로 넘어간다.
const CountdownPage = ({ onComplete }) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (stepIndex + 1 < STEPS.length) {
        setStepIndex((prev) => prev + 1);
      } else {
        onComplete?.();
      }
    }, STEPS[stepIndex].duration);

    return () => clearTimeout(timer);
  }, [stepIndex, onComplete]);

  const step = STEPS[stepIndex];

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center">
      <GameBackground />
      {step.key === "start" ? (
        <img src={GameStartIcon} className="h-[190px] w-[260px]" alt="Game Start" />
      ) : (
        <img src={step.image} className="h-20 w-auto" alt={step.key} />
      )}
    </div>
  );
};

export default CountdownPage;
