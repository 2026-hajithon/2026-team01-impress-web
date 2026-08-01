import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OnboardingPage from "@pages/onboardings/OnboardingPage";

const FrontendTestLoadingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate(location.state?.nextPath ?? "/", { replace: true });
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [location.state, navigate]);

  return <OnboardingPage />;
};

export default FrontendTestLoadingPage;
