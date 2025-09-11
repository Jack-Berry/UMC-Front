// src/api/users.js
import apiFetch from "./apiClient";

export const updateAvatar = (userId, avatarUrl) =>
  apiFetch(`/api/users/${userId}/avatar`, {
    method: "PUT",
    body: JSON.stringify({ avatarUrl }),
  });

export const updateProfile = (userId, updates) =>
  apiFetch(`/api/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
