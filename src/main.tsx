import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initCapacitor } from "./capacitor-init";

// Initialize Capacitor plugins (no-op on web)
initCapacitor();

createRoot(document.getElementById("root")!).render(<App />);
