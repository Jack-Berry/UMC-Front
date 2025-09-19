// src/api/apiClient.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

async function apiFetch(endpoint, options = {}) {
  let accessToken = localStorage.getItem("accessToken");
  let refreshToken = localStorage.getItem("refreshToken");

  let headers = { ...(options.headers || {}) };
  let body = options.body;

  // Detect FormData automatically
  if (body instanceof FormData) {
    // Let the browser set Content-Type for multipart/form-data
  } else {
    headers["Content-Type"] = "application/json";
    if (body && typeof body !== "string") {
      body = JSON.stringify(body);
    }
  }

  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  let res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    body,
    credentials: "include",
  });

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

      localStorage.setItem("accessToken", newAccess);
      localStorage.setItem("refreshToken", newRefresh);

      headers["Authorization"] = `Bearer ${newAccess}`;
      res = await fetch(`${API_URL}${endpoint}`, { ...options, headers, body });
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

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

export default apiFetch;
