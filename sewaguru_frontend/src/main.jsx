import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Let Vite bundle Flowbite instead of <script> in index.html
import "flowbite"; // or: import "flowbite/dist/flowbite.min.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
