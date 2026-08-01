import { BrowserRouter, Route, Routes } from "react-router-dom";
import StartPage from "@pages/StartPage";
import TestPage from "@pages/TestPage";
import Layout from "./Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TestPage />}></Route>
          <Route path="/start" element={<StartPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
