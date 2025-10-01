import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updateAvatar } from "../api/users";
import { fetchUserById } from "../api/auth";
import { setUser } from "../redux/userSlice";

export default function AvatarUploader({ onClose }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  async function handleFile(file) {
    setError("");
    if (!file) return;
    setBusy(true);
    try {
      await updateAvatar(file);

      // Fetch fresh user from backend
      const latest = await fetchUserById("me"); // or refetch via /auth/profile if you prefer
      dispatch(setUser(latest));

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
        capture="user"
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
