import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import Test from "./Test.jsx";
import PresentButton from "./PresentButton.jsx";
import ClubSearchDropdown from "./ClubSearchDropdown.jsx";
import ClubRiskDisplay from "./ClubRiskDisplay.jsx";
import { Card } from "flowbite-react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
