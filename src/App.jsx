// src/App.jsx
import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import SocketProvider from "./realtime/SocketProvider";

export default function App() {
  return (
    <SocketProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-4 flex">
          <Outlet />
        </main>
        <Footer />
      </div>
    </SocketProvider>
  );
}
