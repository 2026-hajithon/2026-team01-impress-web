import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "@pages/HomePage";
import StartPage from "@pages/StartPage";
import CreateRoomNamePage from "@pages/CreateRoomNamePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/start" element={<StartPage />} />
        <Route path="/create-room-name" element={<CreateRoomNamePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
