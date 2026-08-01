import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "@pages/HomePage";
import StartPage from "@pages/StartPage";
import EnterLeaderNamePage from "@pages/createRoom/EnterLeaderNamePage";
import CreateRoomTitlePage from "@pages/createRoom/CreateRoomTitlePage";
import GameResultPage from "@pages/results/GameResultPage";
import CountdownPage from "@pages/games/CountdownPage";
import TestPage from "@pages/TestPage";
import Onboarding1Page from "@pages/onboardings/Onboarding1Page";
import Onboarding2Page from "@pages/onboardings/Onboarding2Page";
import Onboarding3Page from "@pages/onboardings/Onboarding3Page";
import Onboarding4Page from "@pages/onboardings/Onboarding4Page";
import Onboarding5Page from "@pages/onboardings/Onboarding5Page";
import Onboarding6Page from "@pages/onboardings/Onboarding6Page";

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
        <Route path="/test" element={<TestPage />} />
        <Route path="/onboardings/1" element={<Onboarding1Page />} />
        <Route path="/onboardings/2" element={<Onboarding2Page />} />
        <Route path="/onboardings/3" element={<Onboarding3Page />} />
        <Route path="/onboardings/4" element={<Onboarding4Page />} />
        <Route path="/onboardings/5" element={<Onboarding5Page />} />
        <Route path="/onboardings/6" element={<Onboarding6Page />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
