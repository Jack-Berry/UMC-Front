// src/components/EventCard.jsx
import { useState } from "react";
import {
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  CheckCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { registerEvent, unregisterEvent } from "../redux/eventsSlice";

export default function EventCard({ event, expanded, onToggle, isRegistered }) {
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

  return (
    <div className="bg-neutral-800 p-5 rounded-2xl shadow-md hover:shadow-lg transition">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-brand-400 flex items-center gap-2">
            {event.title}
            {registered && !isHost && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
          </h3>

          <p className="flex items-center gap-2 text-sm text-gray-300 mt-2">
            <Calendar size={16} className="text-brand-500" />
            {new Date(event.start_at).toLocaleDateString("en-GB")}
          </p>

          <button
            type="button"
            onClick={() => setShowAddress((s) => !s)}
            aria-expanded={showAddress}
            className="flex items-center gap-2 text-sm text-brand-400 hover:underline mt-1 cursor-pointer"
          >
            <MapPin size={16} />
            {venue || (fullAddress ? "View location" : "Location")}
          </button>
          {showAddress && fullAddress && (
            <p className="ml-6 mt-1 text-xs text-gray-400">{fullAddress}</p>
          )}
        </div>

        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-brand-400 transition"
        >
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

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
                {" "}
                –{" "}
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

          {/* Only show interest toggle if not host */}
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
