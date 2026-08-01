import { useNavigate, useParams } from "react-router-dom";
import { navigateWithTransition } from "@utils/navigateWithTransition";
import CountdownPage from "./CountdownPage";

const GameCountdownRoute = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const handleComplete = () => {
    navigateWithTransition(navigate, `/rooms/${roomCode}/loading`, {
      replace: true,
      state: { nextPath: `/rooms/${roomCode}/round` },
    }, "fade");
  };

  return <CountdownPage onComplete={handleComplete} />;
};

export default GameCountdownRoute;
