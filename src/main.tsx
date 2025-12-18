import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.scss";

createRoot(document.getElementById("root")!).render(
  //<StrictMode>
  <MemoryRouter>
    <App />
  </MemoryRouter>
  //</StrictMode>
);
