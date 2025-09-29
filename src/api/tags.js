// src/api/tags.js
import apiClient from "./apiClient";

/**
 * Fetch all tags or filter by search query.
 *
 * @param {string} [q] - Optional search string to filter tags.
 * @returns {Promise<Array<{id: number, name: string}>>}
 */
export async function fetchTags(q) {
  try {
    const query = q ? `?q=${encodeURIComponent(q)}` : "";
    const res = await apiClient(`/api/tags${query}`, { method: "GET" });
    return res; // array of { id, name }
  } catch (err) {
    console.error("fetchTags error:", err);
    throw err;
  }
}

/**
 * Create a new tag.
 * @param {string} name - Tag name
 * @returns {Promise<{id: number, name: string}>}
 */
export async function createTag(name) {
  try {
    return await apiClient("/api/admin/tags", {
      method: "POST",
      body: { name },
    });
  } catch (err) {
    console.error("createTag error:", err);
    throw err;
  }
}

/**
 * Update a tag by ID.
 * @param {number} id - Tag ID
 * @param {string} name - New tag name
 * @returns {Promise<{id: number, name: string}>}
 */
export async function updateTag(id, name) {
  try {
    return await apiClient(`/api/admin/tags/${id}`, {
      method: "PUT",
      body: { name },
    });
  } catch (err) {
    console.error("updateTag error:", err);
    throw err;
  }
}

/**
 * Delete a tag by ID.
 * @param {number} id - Tag ID
 * @returns {Promise<{success: boolean, id: number}>}
 */
export async function deleteTag(id) {
  try {
    return await apiClient(`/api/admin/tags/${id}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.error("deleteTag error:", err);
    throw err;
  }
}
