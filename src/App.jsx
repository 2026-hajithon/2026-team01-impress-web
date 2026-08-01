import { BrowserRouter, Route, Routes } from "react-router-dom";

import Layout from "./Layout";
import HomePage from "@pages/HomePage";
import StartPage from "@pages/StartPage";
import EnterLeaderNamePage from "@pages/createRoom/EnterLeaderNamePage";
import CreateRoomTitlePage from "@pages/createRoom/CreateRoomTitlePage";
import GameResultPage from "@pages/results/GameResultPage";
import CountdownPage from "@pages/games/CountdownPage";
import TestPage from "@pages/TestPage";
import TestCasePage from "@pages/TestCasePage";
import OnboardingPage from "@pages/onboardings/OnboardingPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/start" element={<StartPage />} />
        <Route path="/enter-leader-name" element={<EnterLeaderNamePage />} />
        <Route path="/create-room-title" element={<CreateRoomTitlePage />} />
        <Route path="/rooms/:roomCode/result" element={<GameResultPage />} />
        <Route path="/countdown" element={<CountdownPage onComplete={() => {}} />} />
        <Route element={<Layout />}>
          <Route path="/test" element={<TestPage />} />
          <Route path="/test/case/:caseId" element={<TestCasePage />} />
        </Route>
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
