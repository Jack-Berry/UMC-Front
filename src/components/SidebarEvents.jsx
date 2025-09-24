import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function SidebarEvents() {
  const events = useSelector((s) => s.events.list) || [];

  const upcoming = events.slice(0, 3);

  return (
    <div className="bg-neutral-800 rounded-2xl shadow-md p-4 space-y-3">
      <h2 className="text-lg font-bold">Upcoming Events</h2>

      {upcoming.length === 0 ? (
        <p className="text-sm text-gray-400">No events yet.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {upcoming.map((e) => (
            <li key={e.id} className="border-b border-neutral-700 pb-2">
              <p className="font-medium text-brand-400">{e.title}</p>
              <p className="text-gray-400 text-xs">
                {new Date(e.start_at).toLocaleDateString("en-GB")}
              </p>
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/events"
        className="block text-sm text-brand-400 hover:underline mt-2"
      >
        See all events →
      </Link>
    </div>
  );
}
