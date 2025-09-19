// src/components/EventModal.jsx
import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import LocationAutocomplete from "./LocationAutocomplete";

// ---- helpers ----
const pad = (n) => String(n).padStart(2, "0");
const toLocalInput = (d) => {
  const x = new Date(d);
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}T${pad(
    x.getHours()
  )}:${pad(x.getMinutes())}`;
};
const roundToNextHour = () => {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  now.setHours(now.getHours() + 1);
  return now;
};

export default function EventModal({
  open,
  onClose,
  onSubmit,
  initialData = null, // event when editing
  mode = "create", // "create" | "edit"
}) {
  const isEdit = mode === "edit" && !!initialData;

  const defaults = useMemo(() => {
    const start = roundToNextHour();
    const end = new Date(start);
    end.setDate(end.getDate() + 1); // default = 1 day long
    return {
      title: "",
      description: "",
      venue: "",
      location: "",
      address: "",
      latitude: null,
      longitude: null,
      start_at: toLocalInput(start),
      end_at: toLocalInput(end),
    };
  }, []);

  const [form, setForm] = useState(defaults);

  // Prefill on open + whenever initialData changes
  useEffect(() => {
    if (!open) return;

    if (isEdit) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        venue: initialData.venue || "", // 👈 prefill existing venue
        location: initialData.location || initialData.address || "",
        address: initialData.address || initialData.location || "",
        latitude: initialData.latitude ?? null,
        longitude: initialData.longitude ?? null,
        start_at: initialData.start_at
          ? toLocalInput(new Date(initialData.start_at))
          : defaults.start_at,
        end_at: initialData.end_at
          ? toLocalInput(new Date(initialData.end_at))
          : defaults.end_at,
      });
    } else {
      setForm(defaults);
    }
  }, [open, isEdit, initialData, defaults]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLocationSelect = ({ name, lat, lng, placeId, raw }) => {
    setForm((prev) => ({
      ...prev,
      address: name ?? raw?.formattedAddress ?? "",
      location: name ?? raw?.formattedAddress ?? "",
      latitude: lat ?? null,
      longitude: lng ?? null,
      place_id: placeId || null,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      location: form.address || form.location || "",
    };
    onSubmit?.(payload);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-neutral-800 p-6 rounded-lg shadow-xl w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit Event" : "Host a New Event"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-neutral-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-2 rounded bg-neutral-700 text-white"
            />
          </div>

          {/* Venue only in edit mode */}
          {isEdit && (
            <div>
              <label className="block text-sm mb-1">Venue</label>
              <input
                type="text"
                name="venue"
                value={form.venue}
                onChange={handleChange}
                className="w-full p-2 rounded bg-neutral-700 text-white"
                placeholder="Enter venue name (e.g. Macclesfield Leisure Centre)"
              />
            </div>
          )}

          <div>
            <label className="block text-sm mb-1">Location</label>
            <LocationAutocomplete onSelect={handleLocationSelect} />
            {(form.address || form.location) && (
              <p className="text-xs text-gray-400 mt-1">
                Selected: {form.address || form.location}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Start Date/Time</label>
              <input
                type="datetime-local"
                name="start_at"
                value={form.start_at}
                onChange={handleChange}
                required
                step="3600"
                className="w-full p-2 rounded bg-neutral-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">End Date/Time</label>
              <input
                type="datetime-local"
                name="end_at"
                value={form.end_at}
                onChange={handleChange}
                step="3600"
                className="w-full p-2 rounded bg-neutral-700 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded text-white font-semibold"
          >
            {isEdit ? "Save Changes" : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
