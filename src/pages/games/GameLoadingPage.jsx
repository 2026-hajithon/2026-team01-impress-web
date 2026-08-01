import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import OnboardingPage from "@pages/onboardings/OnboardingPage";

const LOADING_DURATION = 3000;

const GameLoadingPage = () => {
  const { roomCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate(location.state?.nextPath ?? `/rooms/${roomCode}/round`, { replace: true });
    }, LOADING_DURATION);

    return () => window.clearTimeout(timer);
  }, [location.state, navigate, roomCode]);

  return <OnboardingPage />;
};

export default GameLoadingPage;
