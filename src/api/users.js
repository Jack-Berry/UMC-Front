// src/api/users.js
import apiFetch from "./apiClient";

// 🔹 Avatar upload (no userId param anymore)
export const updateAvatar = (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return apiFetch("/api/users/profile/avatar", {
    method: "PATCH",
    body: formData,
  });
};

// 🔹 Profile update (no userId param anymore)
export const updateProfile = (updates) =>
  apiFetch("/api/users/profile", {
    method: "PATCH",
    body: JSON.stringify(updates),
  });

// Get user by ID (unchanged)
export const getUserById = (userId) =>
  apiFetch(`/api/users/${userId}`, { method: "GET" });

// 🔹 Check if display name is available
export const checkDisplayName = async (displayName) => {
  return apiFetch(
    `/api/users/check-displayname?display_name=${encodeURIComponent(
      displayName
    )}`
  );
};
