import { BrowserRouter, Route, Routes } from "react-router-dom";
import StartPage from "@pages/StartPage";
import TestPage from "@pages/TestPage";
import GameRoundPage from "@pages/games/GameRoundPage";
import Layout from "./Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TestPage />}></Route>
          <Route path="/start" element={<StartPage />} />
          <Route path="/rooms/:roomCode/round" element={<GameRoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
