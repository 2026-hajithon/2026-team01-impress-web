import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OnboardingPage from "@pages/onboardings/OnboardingPage";

const LOADING_DURATION = 3000;

const FrontendTestLoadingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const navigateTimer = window.setTimeout(() => {
      navigate(location.state?.nextPath ?? "/", { replace: true });
    }, LOADING_DURATION);

    return () => window.clearTimeout(navigateTimer);
  }, [location.state, navigate]);

  return <OnboardingPage />;
};

export default FrontendTestLoadingPage;
