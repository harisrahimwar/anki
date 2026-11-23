import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App, { Home } from "./App";
import Admin from "./Admin";
import "./style.css";

import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "admin", element: <Admin /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
