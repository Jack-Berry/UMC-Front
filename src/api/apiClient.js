// src/api/apiClient.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

async function apiFetch(endpoint, options = {}) {
  let accessToken = localStorage.getItem("accessToken");
  let refreshToken = localStorage.getItem("refreshToken");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  // First attempt
  let res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // If access token expired
  if (res.status === 401 && refreshToken) {
    console.log("⏳ Token expired, trying refresh...");

    const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshRes.ok) {
      const { accessToken: newAccess, refreshToken: newRefresh } =
        await refreshRes.json();

      // Save tokens
      localStorage.setItem("accessToken", newAccess);
      localStorage.setItem("refreshToken", newRefresh);

      // Retry original request
      headers["Authorization"] = `Bearer ${newAccess}`;
      res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    } else {
      console.warn("❌ Refresh failed, logging out.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      throw new Error("Session expired, please log in again.");
    }
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "API request failed");
  }

  return res.json();
}

export default apiFetch;
