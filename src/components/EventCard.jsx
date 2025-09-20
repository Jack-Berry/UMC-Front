// src/components/EventCard.jsx
import { useState } from "react";
import {
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Ruler,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { registerEvent, unregisterEvent } from "../redux/eventsSlice";

export default function EventCard({
  event,
  expanded,
  onToggle,
  isRegistered,
  unit = "km", // 🔹 now passed from EventsList
}) {
  const dispatch = useDispatch();
  const currentUser =
    useSelector((s) => s.user?.current) || useSelector((s) => s.user?.data);

  const [showAddress, setShowAddress] = useState(false);

  const registered =
    typeof isRegistered === "boolean" ? isRegistered : !!event.is_registered;

  const isHost =
    currentUser?.id && Number(event.created_by) === Number(currentUser.id);

  const toggleInterest = () => {
    if (registered) dispatch(unregisterEvent(event.id));
    else dispatch(registerEvent(event.id));
  };

  const venue = event.venue || null;
  const fullAddress = event.address || event.location || "";

  // 🔹 Convert distance (stored in DB as km)
  const formatDistance = (km) => {
    if (unit === "mi") return `${(km * 0.621371).toFixed(1)} mi`;
    return `${km.toFixed(1)} km`;
  };

  return (
    <div
      className="bg-neutral-800 rounded-2xl shadow-md hover:shadow-lg transition 
                    h-auto md:h-62 flex flex-col justify-between p-5"
    >
      {/* Top Section */}
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-brand-400 flex items-center gap-2">
            {event.title}
            {registered && !isHost && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </h3>
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-brand-400 transition"
          >
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Bottom Section (always visible info) */}
      <div className="space-y-2 text-sm text-gray-300">
        <p className="flex items-center gap-2">
          <Calendar size={16} className="text-brand-500" />
          {new Date(event.start_at).toLocaleDateString("en-GB")}
        </p>
        <p className="flex items-center gap-2">
          <MapPin size={16} className="text-brand-500" />
          {venue || fullAddress || "Location"}
        </p>
        {event.distance_km != null && (
          <p className="flex items-center gap-2 text-xs text-gray-400">
            <Ruler size={14} className="text-brand-500" />
            {formatDistance(event.distance_km)} away
          </p>
        )}
      </div>

      {/* Expanded Section */}
      {expanded && (
        <div className="mt-4 text-sm text-gray-300 space-y-3">
          <p>{event.description}</p>
          <p>
            <span className="font-medium text-gray-200">Time:</span>{" "}
            {new Date(event.start_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {event.end_at && (
              <>
                {" – "}
                {new Date(event.end_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </>
            )}
          </p>
          {event.creator_name && (
            <p className="text-xs text-gray-500">
              Hosted by{" "}
              <span className="font-medium">{event.creator_name}</span>
            </p>
          )}
          {!isHost && (
            <button
              type="button"
              onClick={toggleInterest}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                registered
                  ? "bg-green-600 hover:bg-green-500"
                  : "bg-brand-600 hover:bg-brand-500"
              }`}
            >
              {registered ? "Unregister" : "Register Interest"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
