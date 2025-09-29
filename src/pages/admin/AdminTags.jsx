// src/pages/admin/AdminTags.jsx
import { useEffect, useState } from "react";
import {
  fetchTags as apiFetchTags,
  createTag as apiCreateTag,
  updateTag as apiUpdateTag,
  deleteTag as apiDeleteTag,
} from "../../api/tags";
import { Tags as TagsIcon } from "lucide-react";

export default function AdminTags({ onChange }) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedId, setSelectedId] = useState("");
  const [editName, setEditName] = useState("");
  const [newName, setNewName] = useState("");

  // -------- helpers --------
  function normalizeTag(name) {
    return name.trim().toLowerCase().replace(/\s+/g, "-");
  }

  function displayTag(tag) {
    if (!tag) return "";
    return tag.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  async function loadTags() {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetchTags();
      setTags(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Failed to fetch tags", e);
      setError("Failed to fetch tags");
    } finally {
      setLoading(false);
    }
  }

  function selectTagById(idStr) {
    const id = idStr ? Number(idStr) : "";
    setSelectedId(idStr);
    const t = (Array.isArray(tags) ? tags : []).find((x) => x.id === id);
    setEditName(displayTag(t?.name) || "");
    setSuccess("");
  }

  async function handleSaveEdit() {
    if (!selectedId || !editName.trim()) return;
    try {
      const updated = await apiUpdateTag(
        Number(selectedId),
        normalizeTag(editName)
      );
      setTags((prev) =>
        [...prev.filter((t) => t.id !== updated.id), updated].sort((a, b) =>
          a.name.localeCompare(b.name)
        )
      );
      if (typeof onChange === "function") onChange();
      setError("");
      setSuccess("Tag updated successfully");
      // hide edit form
      setSelectedId("");
      setEditName("");
    } catch (e) {
      console.error("Failed to update tag", e);
      setError("Failed to update tag");
    }
  }

  async function handleDelete() {
    if (!selectedId) return;
    try {
      await apiDeleteTag(Number(selectedId));
      setTags((prev) => prev.filter((t) => t.id !== Number(selectedId)));
      if (typeof onChange === "function") onChange();
      setError("");
      setSuccess("Tag deleted successfully");
      // hide edit form
      setSelectedId("");
      setEditName("");
    } catch (e) {
      console.error("Failed to delete tag", e);
      setError("Failed to delete tag");
    }
  }

  async function handleCreate() {
    if (!newName.trim()) return;
    try {
      const created = await apiCreateTag(normalizeTag(newName));
      setTags((prev) =>
        [...prev, created].sort((a, b) => a.name.localeCompare(b.name))
      );
      if (typeof onChange === "function") onChange();
      setError("");
      setSuccess("New tag added successfully");
      setNewName("");
    } catch (e) {
      console.error("Failed to create tag", e);
      setError("Failed to create tag");
    }
  }

  return (
    <div className="bg-neutral-900/80 rounded-xl p-6 shadow-md border border-neutral-800">
      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <TagsIcon size={18} /> Manage Tags
      </h2>

      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
      {success && <p className="text-green-400 text-sm mb-2">{success}</p>}
      {loading && <p className="text-gray-400 text-sm mb-2">Loading...</p>}

      {/* Select existing tag */}
      <div className="mb-3">
        <label className="block text-sm mb-1 text-gray-300">Select a tag</label>
        <select
          value={selectedId}
          onChange={(e) => selectTagById(e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-sm text-white"
        >
          <option value="">-- Select a tag --</option>
          {tags.map((t) => (
            <option key={t.id} value={t.id}>
              {displayTag(t.name)}
            </option>
          ))}
        </select>
      </div>

      {/* Edit selected tag */}
      {selectedId && (
        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-300">Rename tag</label>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-sm text-white mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-md text-sm"
            >
              Save
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-md text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      <hr className="border-neutral-700 my-4" />

      {/* Create new tag */}
      <div>
        <label className="block text-sm mb-1 text-gray-300">Add new tag</label>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter new tag name"
          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-sm text-white mb-2"
        />
        <button
          onClick={handleCreate}
          className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-md text-sm"
        >
          Add Tag
        </button>
      </div>
    </div>
  );
}
