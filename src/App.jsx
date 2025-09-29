// src/App.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SocketProvider from "./realtime/SocketProvider";

export default function App() {
  const location = useLocation();

  // Routes that should render centered, full-width content (e.g., login/register)
  const FULL_WIDTH_ROUTES = ["/login", "/register"];
  const isFullWidth = FULL_WIDTH_ROUTES.some((p) =>
    location.pathname.startsWith(p)
  );

  return (
    <SocketProvider>
      {/* Keep the vertical app shell */}
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {/* Center only on selected public routes; otherwise keep default flow */}
        <main
          className={`flex-1 p-4 ${
            isFullWidth ? "flex items-center justify-center" : ""
          }`}
        >
          <Outlet />
        </main>
        <Footer />
      </div>
    </SocketProvider>
  );
}
