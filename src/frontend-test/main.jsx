import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import FrontendTestApp from "./FrontendTestApp";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FrontendTestApp />
  </StrictMode>,
);
