// src/App.jsx
import React from "react";
import Navbar from "./components/Navbar"; // you'll create this
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="p-4">
        <Outlet />
      </main>
    </>
  );
}
