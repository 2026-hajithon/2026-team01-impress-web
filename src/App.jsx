import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "@pages/HomePage";
import StartPage from "@pages/StartPage";
import EnterLeaderNamePage from "@pages/createRoom/EnterLeaderNamePage";
import CreateRoomTitlePage from "@pages/createRoom/CreateRoomTitlePage";
import GameResultPage from "@pages/results/GameResultPage";
import TestPage from "@pages/TestPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/start" element={<StartPage />} />
        <Route path="/enter-leader-name" element={<EnterLeaderNamePage />} />
        <Route path="/create-room-title" element={<CreateRoomTitlePage />} />
        <Route path="/rooms/:roomCode/result" element={<GameResultPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
