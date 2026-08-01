import { useNavigate, useParams } from "react-router-dom";
import CountdownPage from "./CountdownPage";

const GameCountdownRoute = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate(`/rooms/${roomCode}/loading`, {
      replace: true,
      state: { nextPath: `/rooms/${roomCode}/round` },
    });
  };

  return <CountdownPage onComplete={handleComplete} />;
};

export default GameCountdownRoute;
