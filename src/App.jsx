// src/App.jsx
import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="p-4">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
