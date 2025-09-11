import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";
import AvatarUploader from "./AvatarUploader";
import { updateAvatar, updateProfile } from "../api/users";
import { Camera, Upload } from "lucide-react";

export default function ProfileCard() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.current);

  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [usefulAt, setUsefulAt] = useState(user?.useful_at || "");
  const [uselessAt, setUselessAt] = useState(user?.useless_at || "");
  const [showUploader, setShowUploader] = useState(false);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null); // 🔹 single hidden input

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

  async function handleAvatarUploaded(publicUrl) {
    try {
      const { user: partial } = await updateAvatar(user.id, publicUrl);
      dispatch(setUser({ ...user, avatar_url: partial.avatar_url }));
    } catch (e) {
      console.error(e);
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
      setShowUploader(file);
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
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`relative w-40 h-40 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center text-2xl font-bold`}
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
                >
                  <Camera size={16} />
                  Camera
                </button>

                {/* Upload button */}
                <button
                  onClick={openFilePicker}
                  className="flex items-center justify-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white text-sm px-3 py-2 rounded-md w-28 transition"
                >
                  <Upload size={16} />
                  Upload
                </button>
              </div>
            )}
          </div>

          <div>
            {edit ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-neutral-700 text-white px-3 py-2 rounded w-56"
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

        <div className="flex gap-2">
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

      {showUploader && (
        <AvatarUploader
          userId={user.id}
          onUploaded={handleAvatarUploaded}
          onClose={() => setShowUploader(false)}
        />
      )}

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
