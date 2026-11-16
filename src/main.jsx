import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MondialForeign from "./MondialForeign.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MondialForeign />
  </StrictMode>
);
