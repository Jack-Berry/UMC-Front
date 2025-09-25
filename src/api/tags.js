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
