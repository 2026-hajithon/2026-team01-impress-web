import { useNavigate } from "react-router-dom";
import CountdownPage from "@pages/games/CountdownPage";

const FrontendTestCountdownPage = () => {
  const navigate = useNavigate();

  return (
    <CountdownPage
      onComplete={() => navigate("/loading", { replace: true, state: { nextPath: "/game" } })}
    />
  );
};

export default FrontendTestCountdownPage;
