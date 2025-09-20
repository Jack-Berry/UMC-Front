// src/components/UserEvents.jsx
import { useState } from "react";
import {
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import apiFetch from "../api/apiClient";
import { unregisterEvent, fetchEvents } from "../redux/eventsSlice";
import EventModal from "./EventModal";

export default function UserEvents({ events: registeredEventsProp = [] }) {
  const dispatch = useDispatch();

  const [expandedId, setExpandedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // section collapse state
  const [showHosted, setShowHosted] = useState(true);
  const [showRegistered, setShowRegistered] = useState(true);

  // pagination state
  const [hostPage, setHostPage] = useState(1);
  const [regPage, setRegPage] = useState(1);
  const perPage = 6;

  // current user
  const currentUser =
    useSelector((s) => s.user?.current) || useSelector((s) => s.user?.data);
  const myId = currentUser?.id ?? null;

  // full list (for "I’m hosting")
  const allEvents = useSelector((s) => s.events.list) || [];

  // events I'm hosting
  const hostedEvents = myId
    ? allEvents.filter((e) => Number(e.created_by) === Number(myId))
    : [];

  // events I'm registered for (from prop; fallback to redux slice if needed)
  const reduxUserEvents = useSelector((s) => s.events.userEvents) || [];
  const registeredEvents = registeredEventsProp.length
    ? registeredEventsProp
    : reduxUserEvents;

  // paginate hosted + registered separately
  const totalHostPages = Math.ceil(hostedEvents.length / perPage) || 1;
  const totalRegPages = Math.ceil(registeredEvents.length / perPage) || 1;

  const paginatedHosted = hostedEvents.slice(
    (hostPage - 1) * perPage,
    hostPage * perPage
  );
  const paginatedRegistered = registeredEvents.slice(
    (regPage - 1) * perPage,
    regPage * perPage
  );

  const openModal = () => {
    setEditingEvent(null);
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await apiFetch(`/api/events/${eventId}`, { method: "DELETE" });
      dispatch(fetchEvents()); // refresh
    } catch (err) {
      console.error("Failed to delete event", err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingEvent) {
        // update
        await apiFetch(`/api/events/${editingEvent.id}`, {
          method: "PUT",
          body: JSON.stringify(formData),
        });
      } else {
        // create
        await apiFetch("/api/events", {
          method: "POST",
          body: JSON.stringify(formData),
        });
      }
      setShowModal(false);
      setEditingEvent(null);
      dispatch(fetchEvents()); // refresh
    } catch (err) {
      console.error("Failed to save event", err);
    }
  };

  const renderPagination = (page, setPage, totalPages) => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-center items-center gap-4 mt-4">
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
    );
  };

  return (
    <div className="p-5 rounded-lg shadow-lg bg-neutral-800 text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">My Events</h3>
        <button
          onClick={openModal}
          className="bg-brand-600 hover:bg-brand-500 px-4 py-2 rounded text-white font-semibold flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Host Event
        </button>
      </div>

      {/* Hosted events */}
      <section className="mb-6">
        <button
          onClick={() => setShowHosted((s) => !s)}
          className="flex justify-between items-center w-full text-md font-semibold mb-3"
        >
          <span>Events I’m Hosting</span>
          {showHosted ? <ChevronUp /> : <ChevronDown />}
        </button>
        {showHosted &&
          (hostedEvents.length ? (
            <>
              <ul className="space-y-3">
                {paginatedHosted.map((event) => {
                  const isExpanded = expandedId === event.id;
                  return (
                    <li
                      key={event.id}
                      className="bg-slate-700 rounded-lg p-4 flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{event.title}</h4>
                          <div className="flex items-center text-sm text-gray-200 mt-1 gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(event.start_at).toLocaleDateString(
                                "en-GB"
                              )}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {event.venue || event.address}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
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
                        <div className="mt-2 space-y-2 text-sm text-gray-100">
                          <p>
                            {event.description || "No description provided."}
                          </p>
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
                          {(event.address || event.location) && (
                            <p className="text-gray-400 text-sm">
                              <strong>Address:</strong>{" "}
                              {event.address || event.location}
                            </p>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
              {renderPagination(hostPage, setHostPage, totalHostPages)}
            </>
          ) : (
            <p className="text-gray-400 text-sm">
              You’re not hosting any events.
            </p>
          ))}
      </section>

      {/* Registered events */}
      <section>
        <button
          onClick={() => setShowRegistered((s) => !s)}
          className="flex justify-between items-center w-full text-md font-semibold mb-3"
        >
          <span>Events I’m Registered For</span>
          {showRegistered ? <ChevronUp /> : <ChevronDown />}
        </button>
        {showRegistered &&
          (registeredEvents.length ? (
            <>
              <ul className="space-y-3">
                {paginatedRegistered.map((event) => {
                  const isExpanded = expandedId === event.id;
                  return (
                    <li
                      key={event.id}
                      className="bg-slate-700 rounded-lg p-4 flex flex-col gap-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{event.title}</h4>
                          <div className="flex items-center text-sm text-gray-200 mt-1 gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(event.start_at).toLocaleDateString(
                                "en-GB"
                              )}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {event.venue || event.address}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => dispatch(unregisterEvent(event.id))}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Unregister
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
                        <div className="mt-2 space-y-2 text-sm text-gray-100">
                          <p>
                            {event.description || "No description provided."}
                          </p>
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
                          {(event.address || event.location) && (
                            <p className="text-gray-400 text-sm">
                              <strong>Address:</strong>{" "}
                              {event.address || event.location}
                            </p>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
              {renderPagination(regPage, setRegPage, totalRegPages)}
            </>
          ) : (
            <p className="text-gray-400 text-sm">
              You’re not registered for any events yet.
            </p>
          ))}
      </section>

      {/* Reusable Event Modal */}
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
