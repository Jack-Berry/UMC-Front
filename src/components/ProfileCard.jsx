// src/components/ProfileCard.jsx
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";
import { updateAvatar, updateProfile } from "../api/users";
import { Upload, Edit3, Camera } from "lucide-react";
import LocationAutocomplete from "./LocationAutocomplete";
import { fetchUserById } from "../api/auth"; // could be swapped for /auth/profile later

export default function ProfileCard() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.current);

  const [edit, setEdit] = useState(false);

  // Editable fields
  const [displayName, setDisplayName] = useState(
    user?.display_name || user?.first_name || ""
  );
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
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
  const [showMobileOptions, setShowMobileOptions] = useState(false);

  const fileInputRef = useRef(null);

  const initials = (user?.display_name || user?.first_name || "?")
    .slice(0, 1)
    .toUpperCase();
  const avatarUrl = user?.avatar_url || null;

  // 🔹 Save profile changes
  async function handleSave() {
    setSaving(true);
    try {
      const updated = await updateProfile({
        display_name: displayName,
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

  // 🔹 Upload new avatar
  async function uploadAvatarHandler(file) {
    if (!file) return;
    try {
      setUploading(true);
      await updateAvatar(file);
      const latest = await fetchUserById("me"); // could be replaced with /auth/profile
      dispatch(setUser(latest));
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
      setShowMobileOptions(false);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) uploadAvatarHandler(file);
  }

  function triggerFilePicker({ camera = false } = {}) {
    if (fileInputRef.current) {
      if (camera) {
        fileInputRef.current.setAttribute("capture", "user");
      } else {
        fileInputRef.current.removeAttribute("capture");
      }
      fileInputRef.current.click();
    }
  }

  return (
    <div
      className={`w-full bg-neutral-800 p-5 rounded-lg shadow-md relative transition-all duration-300 ${
        edit ? "space-y-6" : ""
      }`}
    >
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Top row */}
      <div
        className={`flex items-center gap-4 ${
          edit ? "flex-col sm:flex-row sm:items-start" : ""
        }`}
      >
        {/* Avatar */}
        <div
          className={`relative rounded-full overflow-hidden bg-gray-600 flex items-center justify-center font-bold ${
            edit ? "w-28 h-28 text-2xl" : "w-16 h-16 text-lg"
          }`}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}

          {edit && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 p-2">
              <button
                onClick={() => triggerFilePicker()}
                className="hidden sm:flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white text-xs px-2 py-1 rounded"
                disabled={uploading}
              >
                <Upload size={14} />
                {uploading ? "..." : "Upload"}
              </button>
              <button
                onClick={() => setShowMobileOptions(true)}
                className="sm:hidden flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white text-xs px-2 py-1 rounded"
                disabled={uploading}
              >
                <Upload size={14} />
                {uploading ? "..." : "Change"}
              </button>
            </div>
          )}
        </div>

        {/* Name + Meta */}
        <div className={`flex-1 ${edit ? "text-center sm:text-left" : ""}`}>
          {edit ? (
            <>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-neutral-700 text-white px-2 py-1 rounded w-full mb-2"
                placeholder="Display name"
              />
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold">
                {user?.display_name || user?.first_name}
              </h2>
              <p className="text-gray-400 text-xs">Member since 2025</p>
              {user?.location && (
                <p className="text-gray-300 text-xs">
                  {user?.show_location ? user.location : ""}
                </p>
              )}
            </>
          )}
        </div>

        {!edit && (
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-700 hover:bg-neutral-600 text-sm"
            onClick={() => setEdit(true)}
          >
            <Edit3 size={14} /> Edit
          </button>
        )}
      </div>

      {/* Useful / Useless row */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="bg-gray-700 p-2 rounded">
          <p className="text-xs text-gray-300">Useful at:</p>
          {edit ? (
            <input
              value={usefulAt}
              onChange={(e) => setUsefulAt(e.target.value)}
              className="bg-neutral-800 text-white px-2 py-1 rounded w-full text-sm"
              placeholder="DIY, spreadsheets..."
            />
          ) : (
            <p className="text-sm">{user?.useful_at || "—"}</p>
          )}
        </div>
        <div className="bg-gray-700 p-2 rounded">
          <p className="text-xs text-gray-300">Useless at:</p>
          {edit ? (
            <input
              value={uselessAt}
              onChange={(e) => setUselessAt(e.target.value)}
              className="bg-neutral-800 text-white px-2 py-1 rounded w-full text-sm"
              placeholder="Parallel parking..."
            />
          ) : (
            <p className="text-sm">{user?.useless_at || "—"}</p>
          )}
        </div>
      </div>

      {/* Location row */}
      {edit ? (
        <div className="bg-gray-700 p-3 rounded mt-4">
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
          <div className="bg-gray-700 p-2 rounded mt-4">
            <p className="text-xs text-gray-300">Location:</p>
            <p className="text-sm">{user.region}</p>
          </div>
        )
      )}

      {/* Save / Cancel */}
      {edit && (
        <div className="flex justify-end gap-2 mt-3">
          <button
            className="px-3 py-1.5 bg-neutral-700 rounded"
            onClick={() => {
              setEdit(false);
              setDisplayName(user?.display_name || user?.first_name || "");
              setFirstName(user?.first_name || "");
              setLastName(user?.last_name || "");
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
            className="px-3 py-1.5 bg-brand-600 rounded disabled:opacity-50"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      )}

      {/* Mobile avatar options */}
      {showMobileOptions && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3 rounded-lg">
          <button
            onClick={() => triggerFilePicker({ camera: true })}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded w-40"
            disabled={uploading}
          >
            <Camera size={16} />
            {uploading ? "..." : "Camera"}
          </button>
          <button
            onClick={() => triggerFilePicker({ camera: false })}
            className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded w-40"
            disabled={uploading}
          >
            <Upload size={16} />
            {uploading ? "..." : "Upload"}
          </button>
          <button
            onClick={() => setShowMobileOptions(false)}
            className="text-gray-300 text-sm underline mt-2"
            disabled={uploading}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
