// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MainLogo from "../assets/Main.png";
import { clearUser } from "../redux/userSlice";
import { resetAssessments } from "../redux/assessmentSlice";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  MessageCircle,
  UserPlus,
} from "lucide-react";

export default function Navbar() {
  const user = useSelector((state) => state.user.current);
  const { threads = [] } = useSelector((s) => s.messages);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  // Count unread messages (threads that have messages and aren’t active)
  const unreadCount = threads.reduce((acc, t) => {
    const last = t.messages?.[t.messages.length - 1];
    if (last && String(last.senderId) !== String(user?.id)) {
      acc += 1;
    }
    return acc;
  }, 0);

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
    <nav className="bg-neutral-900 text-white px-4 py-3 flex justify-between items-center shadow relative">
      {/* Logo */}
      <Link to="/home">
        <img
          src={MainLogo}
          alt="Useless Men's Co-op Logo"
          className="h-16 w-auto hover:opacity-80 transition"
        />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-6">
        {user ? (
          <>
            {/* Dashboard */}
            <Link
              to="/dashboard"
              className="flex items-center gap-1 text-gray-300 hover:text-white"
            >
              <LayoutDashboard size={20} />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>

            {/* Messages with badge */}
            <Link
              to="/messages"
              className="relative flex items-center gap-1 text-gray-300 hover:text-white"
            >
              <MessageCircle size={20} />
              <span className="text-sm font-medium">Messages</span>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-xs font-bold text-white rounded-full px-1.5">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Admin (if applicable) */}
            {user.is_admin && (
              <Link
                to="/admin"
                className="flex items-center gap-1 text-gray-300 hover:text-white"
              >
                <UserPlus size={20} />
                <span className="text-sm font-medium">Admin</span>
              </Link>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-gray-300 hover:text-white"
            >
              <LogOut size={20} />
              <span className="text-sm font-medium">Logout</span>
            </button>

            {/* Reset (less prominent, moved right) */}
            <button
              onClick={handleReset}
              className="ml-4 text-xs text-red-400 hover:text-red-300"
            >
              Reset
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
        {menuOpen ? <X size={24} /> : <Menu size={28} />}
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-full right-0 mt-2 bg-neutral-800 rounded-lg shadow-lg w-40 p-2 flex flex-col gap-2 sm:hidden z-10">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-neutral-700"
                onClick={() => setMenuOpen(false)}
              >
                <LayoutDashboard size={18} /> Dashboard
              </Link>
              <Link
                to="/messages"
                className="relative flex items-center gap-2 px-3 py-2 rounded hover:bg-neutral-700"
                onClick={() => setMenuOpen(false)}
              >
                <MessageCircle size={18} /> Messages
                {unreadCount > 0 && (
                  <span className="absolute right-2 bg-red-500 text-xs font-bold text-white rounded-full px-1.5">
                    {unreadCount}
                  </span>
                )}
              </Link>
              {user.is_admin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-3 py-2 rounded hover:bg-neutral-700"
                  onClick={() => setMenuOpen(false)}
                >
                  <UserPlus size={18} /> Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-neutral-700 text-left"
              >
                <LogOut size={18} /> Logout
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-2 rounded text-sm text-red-400 hover:bg-neutral-700"
              >
                Reset
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
