import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { App } from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { CourseProvider } from "./contexts/CourseContext.tsx";
import { RoundProvider } from "./contexts/RoundContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CourseProvider>
          <RoundProvider>
            <App />
          </RoundProvider>
        </CourseProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
