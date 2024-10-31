import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { WorkoutsProvider } from "./contexts/WorkoutContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WorkoutsProvider>
      <App />
    </WorkoutsProvider>
  </React.StrictMode>
);
