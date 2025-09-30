// src/pages/Register.jsx
import { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      setSuccess(true); // ✅ don’t redirect, show success instead
    } catch (err) {
      alert(err.message);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white px-4">
        <div className="bg-neutral-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Registration Successful</h2>
          <p className="mb-6">
            Please check your email and click the verification link to activate
            your account.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-brand-600 hover:bg-brand-500 rounded text-white"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-screen flex items-center justify-center bg-neutral-900 px-4"
    >
      <div className="bg-neutral-800 p-8 rounded-lg shadow-lg w-full max-w-md text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>

        <div className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded bg-neutral-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full py-2 bg-brand-600 hover:bg-brand-500 transition rounded text-white font-semibold"
        >
          Register
        </button>

        <p className="mt-4 text-sm text-center text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-brand-400 hover:underline cursor-pointer"
          >
            Login here
          </span>
        </p>
      </div>
    </form>
  );
}
