import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLogo from "../assets/Main.png";

const PASSWORD = import.meta.env.VITE_SPLASH_PASSWORD;

export default function SplashGate() {
  const [input, setInput] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("authenticated");
    if (saved === "true") {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      navigate("/home");
    }
  }, [authenticated]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === PASSWORD) {
      localStorage.setItem("authenticated", "true");
      setAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <img src={MainLogo} alt="Logo" className="mx-auto mb-4 w-full h-full" />
        <p className="mb-6 text-gray-300">This page is under construction.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            className="w-full py-2 bg-brand-600 hover:bg-brand-700 rounded text-white font-semibold transition"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
