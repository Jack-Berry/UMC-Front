import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { X, Upload, Link as LinkIcon, FileText } from "lucide-react";
import { uploadNewsImage, fetchLinkPreview } from "../api/news";

export default function NewsModal({ open, onClose, onSubmit, initialData }) {
  const [type, setType] = useState("native");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [pinned, setPinned] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || "native");
      setTitle(initialData.title || "");
      setContent(initialData.content || "");
      setUrl(initialData.url || "");
      setSummary(initialData.summary || "");
      setImageUrl(initialData.image_url || "");
      setPinned(initialData.pinned || false);
    } else {
      setType("native");
      setTitle("");
      setContent("");
      setUrl("");
      setSummary("");
      setImageUrl("");
      setPinned(false);
    }
  }, [initialData]);

  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await uploadNewsImage(file);

      if (res.error) {
        console.error("❌ Upload failed:", res.error);
        alert(`Upload failed: ${res.error}`);
        return;
      }

      console.log("✅ Upload success:", res);
      setImageUrl(res.image_url);
    } catch (err) {
      console.error("❌ Upload request error:", err);
      alert(`Upload failed: ${err.message}`);
    }
  };

  const handleFetchPreview = async () => {
    if (!url) return;
    setLoadingPreview(true);
    try {
      const res = await fetchLinkPreview(url);
      setTitle(res.title || "");
      setSummary(res.summary || "");
      if (res.image_url) setImageUrl(res.image_url);
    } catch (err) {
      console.error("Failed to fetch preview", err);
      alert("Could not fetch preview ❌");
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      type,
      title,
      content,
      url,
      summary,
      image_url: imageUrl,
      pinned,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-neutral-800 rounded-lg shadow-lg max-w-lg w-full p-6 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              {initialData ? "Edit Post" : "Create Post"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Type Selector */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="radio"
                checked={type === "native"}
                onChange={() => setType("native")}
              />
              <FileText size={16} /> Native
            </label>
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="radio"
                checked={type === "external"}
                onChange={() => setType("external")}
              />
              <LinkIcon size={16} /> External
            </label>
          </div>

          {/* External URL */}
          {type === "external" && (
            <div className="space-y-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                className="w-full px-3 py-2 rounded bg-neutral-700 text-white"
              />
              <button
                onClick={handleFetchPreview}
                disabled={loadingPreview}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm"
              >
                {loadingPreview ? "Loading..." : "Fetch Preview"}
              </button>
            </div>
          )}

          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full px-3 py-2 rounded bg-neutral-700 text-white"
          />

          {/* Content (native only) */}
          {type === "native" && (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post..."
              className="w-full px-3 py-2 rounded bg-neutral-700 text-white min-h-[100px]"
            />
          )}

          {/* Summary (external only) */}
          {type === "external" && (
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Short summary"
              className="w-full px-3 py-2 rounded bg-neutral-700 text-white min-h-[80px]"
            />
          )}

          {/* Image Upload */}
          <div className="space-y-2">
            {imageUrl && (
              <img src={imageUrl} alt="" className="rounded max-h-40" />
            )}
            <label className="flex items-center gap-2 cursor-pointer bg-neutral-700 hover:bg-neutral-600 px-3 py-2 rounded text-sm">
              <Upload size={16} /> Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadImage}
                className="hidden"
              />
            </label>
          </div>

          {/* Pinned */}
          <label className="flex items-center gap-2 text-gray-300">
            <input
              type="checkbox"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
            />
            Pin this post to top
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded font-semibold"
            >
              {initialData ? "Save Changes" : "Create Post"}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
