import apiFetch from "./apiClient";

// 🔹 Public endpoints
export const fetchNews = (page = 1, limit = 10) =>
  apiFetch(`/api/news?page=${page}&limit=${limit}`, { method: "GET" });

export const fetchNewsById = (id) =>
  apiFetch(`/api/news/${id}`, { method: "GET" });

// 🔹 Admin endpoints
export const createNews = (data) =>
  apiFetch("/api/admin/news", {
    method: "POST",
    body: data, // no stringify needed
  });

export const updateNews = (id, data) =>
  apiFetch(`/api/admin/news/${id}`, {
    method: "PUT",
    body: data,
  });

export const deleteNews = (id) =>
  apiFetch(`/api/admin/news/${id}`, { method: "DELETE" });

// 🔹 Image upload (multipart form-data)
export const uploadNewsImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  return apiFetch("/api/admin/news/upload", {
    method: "POST",
    body: formData, // apiClient will detect FormData
  });
};

// 🔹 External link preview
export const fetchLinkPreview = (url) =>
  apiFetch("/api/admin/news/link-preview", {
    method: "POST",
    body: { url }, // plain object, apiClient will stringify
  });
