// src/pages/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import apiFetch from "../api/apiClient";

export default function VerifyEmail() {
  const [status, setStatus] = useState("Verifying...");
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    console.log("VerifyEmail mounted with token:", token);
    if (!token) {
      setStatus("Invalid verification link.");
      return;
    }

    apiFetch(`/api/auth/verify-email?token=${token}`)
      .then(() => {
        setStatus("Email verified! You can now log in.");
        setIsSuccess(true);
        // Optional auto-redirect after 3s:
        // setTimeout(() => navigate("/login"), 3000);
      })
      .catch(() => setStatus("Verification failed or link expired."));
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white px-4">
      <div className="bg-neutral-800 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
        <p className={`mb-6 ${isSuccess ? "text-green-400" : "text-red-400"}`}>
          {status}
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
