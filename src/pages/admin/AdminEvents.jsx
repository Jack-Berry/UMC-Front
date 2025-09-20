// src/pages/admin/AdminEvents.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Calendar,
  MapPin,
  Pencil,
  Trash2,
  PlusCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import apiFetch from "../../api/apiClient";
import { fetchEvents } from "../../redux/eventsSlice";
import EventModal from "../../components/EventModal";
import LocationAutocomplete from "../../components/LocationAutocomplete";

export default function AdminEvents() {
  const dispatch = useDispatch();
  const events = useSelector((s) => s.events.list) || [];

  const [expandedId, setExpandedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 6;

  const [searchLocation, setSearchLocation] = useState(null);

  useEffect(() => {
    if (searchLocation) {
      dispatch(
        fetchEvents({ lat: searchLocation.lat, lng: searchLocation.lng })
      );
    } else {
      dispatch(fetchEvents());
    }
  }, [dispatch, searchLocation]);

  const openModal = () => {
    setEditingEvent(null);
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await apiFetch(`/api/events/${eventId}`, { method: "DELETE" });
      dispatch(fetchEvents());
    } catch (err) {
      console.error("Failed to delete event", err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingEvent) {
        await apiFetch(`/api/events/${editingEvent.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
      } else {
        await apiFetch("/api/events", {
          method: "POST",
          body: JSON.stringify(formData),
        });
      }
      setShowModal(false);
      setEditingEvent(null);
      dispatch(fetchEvents());
    } catch (err) {
      console.error("Failed to save event", err);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(events.length / perPage);
  const paginatedEvents = events.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-5 bg-neutral-900 text-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Events</h1>
        <button
          onClick={openModal}
          className="bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded text-white font-semibold flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" /> Create Event
        </button>
      </div>

      {/* 🔹 Location Search */}
      <div className="mb-4">
        <LocationAutocomplete
          placeholder="Search a location..."
          onSelect={(loc) => {
            setSearchLocation(loc);
            setPage(1);
          }}
        />
        {searchLocation && (
          <p className="mt-2 text-sm text-gray-400">
            Showing events near{" "}
            <span className="font-medium">{searchLocation.name}</span>.{" "}
            <button
              className="text-brand-400 hover:underline"
              onClick={() => {
                setSearchLocation(null);
                setPage(1);
              }}
            >
              Reset
            </button>
          </p>
        )}
      </div>

      {paginatedEvents.length ? (
        <ul className="space-y-4">
          {paginatedEvents.map((event) => {
            const isExpanded = expandedId === event.id;
            return (
              <li
                key={event.id}
                className="bg-slate-800 rounded-lg p-4 flex flex-col gap-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <div className="flex items-center text-sm text-gray-300 gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(event.start_at).toLocaleDateString("en-GB")}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.venue || event.address}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(event)}
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : event.id)
                      }
                      className="text-gray-300 hover:text-white"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="text-sm text-gray-200 space-y-2 mt-2">
                    <p>{event.description || "No description provided."}</p>
                    <p>
                      <strong>Time:</strong>{" "}
                      {new Date(event.start_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      –{" "}
                      {new Date(event.end_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {event.address && (
                      <p>
                        <strong>Address:</strong> {event.address}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      Created by user ID: {event.created_by}
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-400">No events yet.</p>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 rounded bg-neutral-700 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded bg-neutral-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <EventModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        initialData={editingEvent}
        mode={editingEvent ? "edit" : "create"}
      />
    </div>
  );
}
