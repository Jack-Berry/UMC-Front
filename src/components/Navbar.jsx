// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-neutral-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div>
        <Link
          to="/dashboard"
          className="text-xl font-bold tracking-wide hover:text-brand-400 transition"
        >
          Useless Men's Co-operative
        </Link>
      </div>
      <div>
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-brand-600 hover:bg-brand-500 transition text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Logout
          </button>
        ) : (
          <div className="flex gap-4">
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
          </div>
        )}
      </div>
    </nav>
  );
}
