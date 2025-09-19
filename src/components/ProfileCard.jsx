// ProfileCard.jsx
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";
import { updateAvatar, updateProfile } from "../api/users";
import { Camera, Upload, Edit3 } from "lucide-react";
import LocationAutocomplete from "./LocationAutocomplete";

export default function ProfileCard() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.current);

  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [usefulAt, setUsefulAt] = useState(user?.useful_at || "");
  const [uselessAt, setUselessAt] = useState(user?.useless_at || "");
  const [location, setLocation] = useState(user?.location || "");
  const [lat, setLat] = useState(user?.lat || null);
  const [lng, setLng] = useState(user?.lng || null);
  const [region, setRegion] = useState(user?.region || "");
  const [showLocation, setShowLocation] = useState(
    user?.show_location || false
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);
  const initials = (user?.name || "?").slice(0, 1);

  // ✅ avatar_url is already a full URL from backend
  const avatarUrl = user?.avatar_url || null;

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await updateProfile(user.id, {
        name,
        useful_at: usefulAt,
        useless_at: uselessAt,
        location,
        lat,
        lng,
        region,
        show_location: showLocation,
      });

      dispatch(setUser(updated));
      setEdit(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function uploadAvatarHandler(file) {
    if (!file) return;
    try {
      setUploading(true);
      const data = await updateAvatar(user.id, file);
      dispatch(setUser({ ...user, avatar_url: data.user.avatar_url }));
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
    if (file) uploadAvatarHandler(file);
  }

  return (
    <div className="relative bg-neutral-800 p-6 rounded-lg shadow-md space-y-6">
      {/* Hidden input */}
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
          {/* Avatar */}
          <div className="relative w-44 h-44 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center text-2xl font-bold">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}

            {edit && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 p-2">
                <button
                  onClick={openCamera}
                  className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white text-sm px-3 py-2 rounded-md w-28 transition sm:hidden"
                  disabled={uploading}
                >
                  <Camera size={16} />
                  {uploading ? "..." : "Camera"}
                </button>
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

          {/* Name + Meta */}
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
                {user?.location && (
                  <p className="text-gray-300 text-sm">
                    {user?.show_location ? user.location : "📍 Hidden"}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {!edit && (
          <div className="hidden sm:flex absolute top-4 right-4">
            <button
              className="p-2 rounded-full bg-neutral-700 hover:bg-neutral-600 text-white shadow-md"
              onClick={() => setEdit(true)}
            >
              <Edit3 size={18} />
            </button>
          </div>
        )}
      </div>

      {!edit && (
        <div className="flex justify-center sm:hidden">
          <button
            className="p-2 rounded-full bg-neutral-700 hover:bg-neutral-600 text-white shadow-md"
            onClick={() => setEdit(true)}
          >
            <Edit3 size={18} />
          </button>
        </div>
      )}

      {edit && (
        <div className="flex gap-2 justify-center sm:justify-end">
          <button
            className="px-4 py-2 bg-neutral-700 rounded"
            onClick={() => {
              setEdit(false);
              setName(user?.name || "");
              setUsefulAt(user?.useful_at || "");
              setUselessAt(user?.useless_at || "");
              setLocation(user?.location || "");
              setLat(user?.lat || null);
              setLng(user?.lng || null);
              setShowLocation(user?.show_location || false);
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
        </div>
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

          {/* Location field with autocomplete */}
          {edit ? (
            <div className="bg-gray-700 p-3 rounded sm:col-span-2">
              <p className="text-sm text-gray-300 mb-2">Location:</p>
              <LocationAutocomplete
                placeholder="Enter your city or region"
                onSelect={(place) => {
                  setLocation(place.name || "");
                  setLat(place.lat || null);
                  setLng(place.lng || null);

                  const regionName =
                    place.raw?.addressComponents?.find((c) =>
                      c.types.includes("locality")
                    )?.longText ||
                    place.raw?.addressComponents?.find((c) =>
                      c.types.includes("administrative_area_level_2")
                    )?.longText ||
                    place.raw?.displayName?.text ||
                    "";

                  setRegion(regionName);
                }}
              />
              <label className="flex items-center gap-2 text-gray-300 text-sm mt-2">
                <input
                  type="checkbox"
                  checked={showLocation}
                  onChange={(e) => setShowLocation(e.target.checked)}
                />
                Show location publicly
              </label>
            </div>
          ) : (
            user?.show_location &&
            user?.region && (
              <div className="bg-gray-700 p-3 rounded sm:col-span-2">
                <p className="text-sm text-gray-300 mb-2">Location:</p>
                <p className="text-white font-medium">{user.region}</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
