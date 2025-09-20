// src/api/users.js
import apiFetch from "./apiClient";

// Avatar upload (multipart form-data)
export const updateAvatar = (userId, file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return apiFetch(`/api/users/${userId}/avatar`, {
    method: "PUT",
    body: formData,
  });
};

// Profile update (JSON)
export const updateProfile = (userId, updates) =>
  apiFetch(`/api/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
