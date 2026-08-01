import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Layout from "./Layout";
import StartPage from "@pages/StartPage";
import EnterLeaderNamePage from "@pages/createRoom/EnterLeaderNamePage";
import CreateRoomTitlePage from "@pages/createRoom/CreateRoomTitlePage";
import LeaderWaitingPage from "@pages/createRoom/LeaderWaitingPage";
import EnterRoomCodePage from "@pages/joinRoom/EnterRoomCodePage";
import ScanRoomQrPage from "@pages/joinRoom/ScanRoomQrPage";
import EnterMemberNamePage from "@pages/joinRoom/EnterMemberNamePage";
import MemberWaitingPage from "@pages/joinRoom/MemberWaitingPage";
import GameCountdownRoute from "@pages/games/GameCountdownRoute";
import GameLoadingPage from "@pages/games/GameLoadingPage";
import GameRoundPage from "@pages/games/GameRoundPage";
import CountdownPage from "@pages/games/CountdownPage";
import GameResultPage from "@pages/results/GameResultPage";
import OnboardingPage from "@pages/onboardings/OnboardingPage";
import TestPage from "@pages/TestPage";
import TestCasePage from "@pages/TestCasePage";
import ApiConnectionTestPage from "@pages/ApiConnectionTestPage";
import { isHostRole } from "@utils/participantRoles";

const WaitingRoomRoute = () => {
  const role = sessionStorage.getItem("role");
  return isHostRole(role) ? <LeaderWaitingPage /> : <MemberWaitingPage />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/start" element={<Navigate to="/" replace />} />
        <Route path="/enter-leader-name" element={<EnterLeaderNamePage />} />
        <Route path="/create-room-title" element={<CreateRoomTitlePage />} />
        <Route path="/leader-waiting" element={<WaitingRoomRoute />} />
        <Route path="/rooms/:roomCode/waiting" element={<WaitingRoomRoute />} />
        <Route path="/rooms/:roomCode/countdown" element={<GameCountdownRoute />} />
        <Route path="/rooms/:roomCode/loading" element={<GameLoadingPage />} />
        <Route path="/rooms/:roomCode/round" element={<GameRoundPage />} />
        <Route path="/rooms/:roomCode/result" element={<GameResultPage />} />
        <Route path="/enter-room-code" element={<EnterRoomCodePage />} />
        <Route path="/scan-room-qr" element={<ScanRoomQrPage />} />
        <Route path="/enter-member-name" element={<EnterMemberNamePage />} />
        <Route path="/member-waiting" element={<MemberWaitingPage />} />
        <Route path="/countdown" element={<CountdownPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route element={<Layout />}>
          <Route path="/test" element={<TestPage />} />
          <Route path="/test/case/:caseId" element={<TestCasePage />} />
          <Route path="/test/api" element={<ApiConnectionTestPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
