const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";

export const registerUser = async (userData) => {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
};

export const loginUser = async (credentials) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

export const fetchUserById = async (userId) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050";
  const res = await fetch(`${API_URL}/api/auth/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};
