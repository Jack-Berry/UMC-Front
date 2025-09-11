// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MainLogo from "../assets/Main.png";
import { clearUser } from "../redux/userSlice";
import { resetAssessments } from "../redux/assessmentSlice";

export default function Navbar() {
  const user = useSelector((state) => state.user.current);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(resetAssessments());
    navigate("/login");
  };

  const handleReset = () => {
    dispatch(clearUser());
    dispatch(resetAssessments());
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
