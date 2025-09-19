// src/components/EventsList.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EventCard from "./EventCard";
import { fetchEvents } from "../redux/eventsSlice";

export default function EventsList() {
  const dispatch = useDispatch();
  const events = useSelector((s) => s.events.list);
  const userEvents = useSelector((s) => s.events.userEvents) || [];
  const status = useSelector((s) => s.events.status);
  const error = useSelector((s) => s.events.error);

  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (status === "idle") dispatch(fetchEvents());
  }, [status, dispatch]);

  const registeredIds = new Set(userEvents.map((e) => e.id));
  const toggleExpand = (id) =>
    setExpandedId((prev) => (prev === id ? null : id));

  if (status === "loading")
    return <p className="text-gray-400">Loading events...</p>;
  if (status === "failed")
    return <p className="text-red-400">Error: {error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Upcoming Events</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            expanded={expandedId === event.id}
            onToggle={() => toggleExpand(event.id)}
            isRegistered={registeredIds.has(event.id) || !!event.is_registered}
          />
        ))}
      </div>
    </div>
  );
}
