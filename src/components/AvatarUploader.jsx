import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updateAvatar } from "../api/users";
import { setUser } from "../redux/userSlice";

export default function AvatarUploader({ userId, onClose }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  async function handleFile(file) {
    setError("");
    if (!file) return;
    setBusy(true);
    try {
      const data = await updateAvatar(userId, file);

      // ✅ Update Redux user object
      dispatch(setUser({ id: userId, avatar_url: data.user.avatar_url }));

      // optionally call parent callbacks if needed
      onClose?.();
    } catch (e) {
      console.error(e);
      setError("Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-4 bg-neutral-900 rounded-lg">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="user" // ✅ add this if you want mobile camera
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <button
        className="px-4 py-2 bg-brand-600 rounded mr-2"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
      >
        {busy ? "Uploading..." : "Choose image"}
      </button>
      <button className="px-3 py-2 bg-neutral-700 rounded" onClick={onClose}>
        Cancel
      </button>
      {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
    </div>
  );
}
