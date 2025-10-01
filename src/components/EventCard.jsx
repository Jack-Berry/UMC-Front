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
  unit = "km",
}) {
  const dispatch = useDispatch();
  const currentUser =
    useSelector((s) => s.user?.current) || useSelector((s) => s.user?.data);

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

  const formatDistance = (km) => {
    if (unit === "mi") return `${(km * 0.621371).toFixed(1)} mi`;
    return `${km.toFixed(1)} km`;
  };

  return (
    <div className="bg-neutral-800 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col h-full overflow-hidden">
      {/* Main content */}
      <div className="flex flex-1">
        {/* Date strip */}
        <div className="flex flex-col items-center justify-center bg-neutral-700 px-3 py-4 min-w-[64px] rounded-tr-none rounded-br-none">
          <span className="text-[10px] uppercase text-gray-400 tracking-wide">
            {new Date(event.start_at).toLocaleString("en-US", {
              month: "short",
            })}
          </span>
          <span className="text-xl font-bold text-white leading-none">
            {new Date(event.start_at).getDate()}
          </span>
        </div>

        {/* Info side */}
        <div className="flex flex-col flex-1 p-3">
          {/* Title + toggle */}
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-sm font-semibold text-brand-400 leading-snug">
              {event.title}
              {registered && !isHost && (
                <CheckCircle className="w-4 h-4 inline ml-1 text-green-500" />
              )}
            </h3>
            <button
              onClick={onToggle}
              className="text-gray-400 hover:text-brand-400 transition"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {/* Basic info */}
          <div className="space-y-1 text-xs text-gray-300 flex-1">
            <p className="flex items-center gap-1.5">
              <Calendar size={12} className="text-brand-500" />
              {new Date(event.start_at).toLocaleDateString("en-GB")}
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin size={12} className="text-brand-500" />
              {venue || fullAddress || "Location"}
            </p>
            {event.distance_km != null && (
              <p className="flex items-center gap-1.5 text-gray-400">
                <Ruler size={12} className="text-brand-500" />
                {formatDistance(event.distance_km)} away
              </p>
            )}
          </div>

          {/* Expanded info */}
          {expanded && (
            <div className="mt-2 text-xs text-gray-300 space-y-1.5">
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
            </div>
          )}
        </div>
      </div>

      {/* Action bar */}
      {!isHost && (
        <button
          type="button"
          onClick={toggleInterest}
          className={`w-full py-2 text-sm font-medium transition ${
            registered
              ? "bg-green-600 hover:bg-green-500 text-white"
              : "bg-brand-600 hover:bg-brand-500 text-white"
          }`}
        >
          {registered ? "Unregister" : "Register Interest"}
        </button>
      )}
    </div>
  );
}
