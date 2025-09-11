import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";
import { supabase } from "../lib/supabaseClient";
import { updateAvatar, updateProfile } from "../api/users";
import { Camera, Upload } from "lucide-react";

export default function ProfileCard() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.current);

  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [usefulAt, setUsefulAt] = useState(user?.useful_at || "");
  const [uselessAt, setUselessAt] = useState(user?.useless_at || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  const initials = (user?.name || "?").slice(0, 1);

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await updateProfile(user.id, {
        name,
        useful_at: usefulAt,
        useless_at: uselessAt,
      });
      dispatch(setUser(updated));
      setEdit(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function uploadAvatar(file) {
    if (!file) return;
    try {
      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`; // user folder

      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      const { user: partial } = await updateAvatar(user.id, publicUrl);
      dispatch(setUser({ ...user, avatar_url: partial.avatar_url }));
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  function openCamera() {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("capture", "user");
      fileInputRef.current.click();
    }
  }

  function openFilePicker() {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute("capture");
      fileInputRef.current.click();
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      uploadAvatar(file); // 🔹 direct upload
    }
  }

  return (
    <div className="bg-neutral-800 p-6 rounded-lg shadow-md space-y-6">
      {/* Hidden input for both buttons */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div
            className={`relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center text-2xl font-bold`}
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}

            {edit && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 p-2">
                {/* Camera button (hidden on desktop) */}
                <button
                  onClick={openCamera}
                  className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white text-sm px-3 py-2 rounded-md w-28 transition sm:hidden"
                  disabled={uploading}
                >
                  <Camera size={16} />
                  {uploading ? "..." : "Camera"}
                </button>

                {/* Upload button */}
                <button
                  onClick={openFilePicker}
                  className="flex items-center justify-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white text-sm px-3 py-2 rounded-md w-28 transition"
                  disabled={uploading}
                >
                  <Upload size={16} />
                  {uploading ? "..." : "Upload"}
                </button>
              </div>
            )}
          </div>

          <div className="text-center sm:text-left">
            {edit ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-neutral-700 text-white px-3 py-2 rounded w-56 max-w-full"
                placeholder="Your name"
              />
            ) : (
              <>
                <h2 className="text-2xl font-semibold">{user?.name}</h2>
                <p className="text-gray-400 text-sm">Member since 2025</p>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2 justify-center sm:justify-end">
          {edit ? (
            <>
              <button
                className="px-4 py-2 bg-neutral-700 rounded"
                onClick={() => {
                  setEdit(false);
                  setName(user?.name || "");
                  setUsefulAt(user?.useful_at || "");
                  setUselessAt(user?.useless_at || "");
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-brand-600 rounded disabled:opacity-50"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <button
              className="px-4 py-2 bg-neutral-700 rounded"
              onClick={() => setEdit(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* About Me */}
      <div>
        <h3 className="text-lg font-semibold mb-2">About Me</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-700 p-3 rounded">
            <p className="text-sm text-gray-300 mb-2">I am useful at:</p>
            {edit ? (
              <input
                value={usefulAt}
                onChange={(e) => setUsefulAt(e.target.value)}
                className="bg-neutral-800 text-white px-3 py-2 rounded w-full"
                placeholder="e.g., DIY, spreadsheets, cooking"
              />
            ) : (
              <p className="text-white font-medium">
                {user?.useful_at || "⚒️ Not set yet"}
              </p>
            )}
          </div>

          <div className="bg-gray-700 p-3 rounded">
            <p className="text-sm text-gray-300 mb-2">I am useless at:</p>
            {edit ? (
              <input
                value={uselessAt}
                onChange={(e) => setUselessAt(e.target.value)}
                className="bg-neutral-800 text-white px-3 py-2 rounded w-full"
                placeholder="e.g., public speaking, parallel parking"
              />
            ) : (
              <p className="text-white font-medium">
                {user?.useless_at || "🤷 Not set yet"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
