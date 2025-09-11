import { useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AvatarUploader({ userId, onUploaded, onClose }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file) {
    setError("");
    if (!file) return;
    setBusy(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${userId}-${Date.now()}.${ext}`;
      console.log("Supabase URL in client:", supabase.supabaseUrl);

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      onUploaded?.(data.publicUrl);

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
