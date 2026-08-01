import { useNavigate } from "react-router-dom";
import GameEndPage from "@pages/results/GameEndPage";

const FrontendTestEndPage = () => {
  const navigate = useNavigate();

  return (
    <GameEndPage
      loading={false}
      onViewResult={() =>
        navigate("/loading", { state: { nextPath: "/report" } })
      }
    />
  );
};

export default FrontendTestEndPage;
