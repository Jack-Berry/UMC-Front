import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MainLogo from "../assets/Main.png";
import { clearUser } from "../redux/userSlice";
import { resetAssessments } from "../redux/assessmentSlice";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const user = useSelector((state) => state.user.current);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(clearUser());
    dispatch(resetAssessments());
    navigate("/login");
  };

  const handleReset = () => {
    dispatch(clearUser());
    dispatch(resetAssessments());
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <nav className="bg-neutral-800 text-white px-4 py-3 flex justify-between items-center shadow-md relative">
      {/* Logo */}
      <Link to="/home">
        <img
          src={MainLogo}
          alt="Useless Men's Co-op Logo"
          className="h-24 w-auto hover:opacity-80 transition"
        />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-4">
        <button
          onClick={handleReset}
          className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded-md text-sm"
        >
          Reset
        </button>
        {user ? (
          <>
            <Link
              to="/dashboard"
              className="bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm hover:text-brand-400">
              Login
            </Link>
            <Link to="/register" className="text-sm hover:text-brand-400">
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile Burger */}
      <button
        className="sm:hidden"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={36} />}
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-full right-0 mt-2 bg-neutral-700 rounded-lg shadow-lg w-40 p-2 flex flex-col gap-2 sm:hidden z-10">
          <button
            onClick={handleReset}
            className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded-md text-sm"
          >
            Reset
          </button>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="bg-brand-600 hover:bg-brand-500 px-3 py-2 rounded text-sm text-center"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-brand-600 hover:bg-brand-500 px-3 py-2 rounded text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm hover:text-brand-400"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm hover:text-brand-400"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
