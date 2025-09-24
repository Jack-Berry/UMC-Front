// src/components/EventsList.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EventCard from "./EventCard";
import { fetchEvents } from "../redux/eventsSlice";
import LocationAutocomplete from "./LocationAutocomplete";
import LoadingSpinner from "./LoadingSpinner";

export default function EventsList({ showPerPageControls = false }) {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.current);
  const events = useSelector((s) => s.events.list);
  const userEvents = useSelector((s) => s.events.userEvents) || [];
  const status = useSelector((s) => s.events.status);
  const error = useSelector((s) => s.events.error);

  const [expandedId, setExpandedId] = useState(null);
  const [unit, setUnit] = useState("km");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);

  const [searchLocation, setSearchLocation] = useState(null);

  useEffect(() => {
    if (!user) return;
    if (status === "idle" && !searchLocation) {
      if (user.lat && user.lng) {
        dispatch(fetchEvents({ lat: user.lat, lng: user.lng }));
      } else {
        dispatch(fetchEvents());
      }
    }
  }, [status, dispatch, user, searchLocation]);

  const registeredIds = new Set(userEvents.map((e) => e.id));
  const toggleExpand = (id) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const totalPages = Math.ceil(events.length / perPage);
  const paginated = events.slice((page - 1) * perPage, page * perPage);

  if (!user) {
    return (
      <div className="text-gray-400 text-sm">
        Log in to see upcoming events near you.
      </div>
    );
  }

  if (status === "loading") return <LoadingSpinner text="Loading events..." />;
  if (status === "failed")
    return <p className="text-red-400">Error: {error}</p>;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Upcoming Events</h2>
          {/* Unit toggle */}
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => setUnit("km")}
              className={`px-2 py-1 rounded ${
                unit === "km" ? "bg-brand-600 text-white" : "bg-neutral-700"
              }`}
            >
              KM
            </button>
            <button
              onClick={() => setUnit("mi")}
              className={`px-2 py-1 rounded ${
                unit === "mi" ? "bg-brand-600 text-white" : "bg-neutral-700"
              }`}
            >
              MI
            </button>
          </div>
        </div>

        {/* Location search */}
        <LocationAutocomplete
          placeholder="Search a location..."
          onSelect={(loc) => {
            setPage(1);
            setSearchLocation(loc);
            dispatch(fetchEvents({ lat: loc.lat, lng: loc.lng }));
          }}
        />

        {searchLocation && (
          <div className="text-xs text-gray-400 mt-1">
            Showing events near{" "}
            <span className="font-medium text-gray-200">
              {searchLocation.name || searchLocation.venue}
            </span>
            .{" "}
            <button
              onClick={() => {
                setSearchLocation(null);
                setPage(1);
                if (user.lat && user.lng) {
                  dispatch(fetchEvents({ lat: user.lat, lng: user.lng }));
                } else {
                  dispatch(fetchEvents());
                }
              }}
              className="text-brand-400 hover:underline ml-1"
            >
              Click here to return
            </button>
          </div>
        )}
      </div>

      {/* Events grid */}
      {events.length === 0 ? (
        <p className="text-gray-400 text-sm">No events available.</p>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {paginated.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                expanded={expandedId === event.id}
                onToggle={() => toggleExpand(event.id)}
                isRegistered={
                  registeredIds.has(event.id) || !!event.is_registered
                }
                unit={unit}
              />
            ))}
          </div>

          {/* Pagination & optional per-page controls */}
          {totalPages > 1 && (
            <div className="relative mt-6">
              {/* Pagination always visible */}
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1 bg-neutral-700 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="text-sm text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-3 py-1 bg-neutral-700 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>

              {/* Show more buttons only if enabled */}
              {showPerPageControls && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Show:</span>
                  {[6, 12, 24].map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setPerPage(size);
                        setPage(1);
                      }}
                      className={`px-3 py-1 rounded ${
                        perPage === size
                          ? "bg-brand-600 text-white"
                          : "bg-neutral-700 hover:bg-neutral-600"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
