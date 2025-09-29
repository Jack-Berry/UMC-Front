// src/pages/Login.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { setUser } from "../redux/userSlice";
import { getAssessment } from "../redux/assessmentSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await loginUser({ email, password });

      // ✅ store user in Redux
      dispatch(setUser(res.user));

      // ✅ hydrate Redux with fresh assessment results
      const userId = res.user.id;
      const categories = [
        "diy",
        "technology",
        "self-care",
        "communication",
        "community",
      ];
      categories.forEach((type) => {
        dispatch(getAssessment({ assessmentType: type, userId }));
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
      setError("Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
      <div className="w-full max-w-md p-6 rounded-lg bg-neutral-800 shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <div>
            <label htmlFor="email" className="block text-sm mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
