// src/pages/SplashGate.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PASSWORD = import.meta.env.VITE_SPLASH_PASSWORD;

export default function SplashGate() {
  const [input, setInput] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("authenticated");
    if (saved === "true") {
      setAuthenticated(true);
      navigate("/login");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === PASSWORD) {
      localStorage.setItem("authenticated", "true");
      setAuthenticated(true);
      navigate("/login");
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <div className="splash-container">
      <h1>Useless Men's Co-op</h1>
      <p>This page is under construction.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter password"
        />
        <button type="submit">Enter</button>
      </form>
    </div>
  );
}
