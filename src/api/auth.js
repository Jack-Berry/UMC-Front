// src/api/auth.js
import apiFetch from "./apiClient";

export const registerUser = (userData) =>
  apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const loginUser = async (credentials) => {
  const res = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  // Store tokens if provided
  if (res.accessToken) {
    localStorage.setItem("accessToken", res.accessToken);
  }
  if (res.refreshToken) {
    localStorage.setItem("refreshToken", res.refreshToken);
  }
  if (res.user) {
    localStorage.setItem("user", JSON.stringify(res.user));
  }

  return res;
};

export const fetchUserById = (userId) =>
  apiFetch(`/api/auth/user/${userId}`, { method: "GET" });

export const resendVerification = (email) =>
  apiFetch("/api/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
