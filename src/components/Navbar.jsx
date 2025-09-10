// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLogo from "../assets/Main.png";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleReset = () => {
    localStorage.clear();
    navigate("/gate");
  };

  return (
    <nav className="bg-neutral-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div className="flex items-center">
        <Link to="/home">
          <img
            src={MainLogo}
            alt="Useless Men's Co-op Logo"
            className="h-20 w-auto hover:opacity-80 transition"
          />
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={handleReset}
          className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-md text-sm"
        >
          Reset
        </button>
        {user ? (
          <>
            <Link
              to="/dashboard"
              className="bg-brand-600 hover:bg-brand-500 transition text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-brand-600 hover:bg-brand-500 transition text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm text-white hover:text-brand-400 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm text-white hover:text-brand-400 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
