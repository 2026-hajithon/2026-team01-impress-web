import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "@pages/HomePage";
import ModalTestPage from "@pages/ModalTestPage";
import StartPage from "@pages/StartPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/start" element={<StartPage />} />
        <Route
          path="/modal-test"
          element={<ModalTestPage />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
