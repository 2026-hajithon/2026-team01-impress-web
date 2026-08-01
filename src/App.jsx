import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "@pages/HomePage";
import StartPage from "@pages/StartPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/start" element={<StartPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
