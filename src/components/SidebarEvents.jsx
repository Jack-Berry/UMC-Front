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
        <ul className="space-y-2">
          {upcoming.map((e) => {
            const date = new Date(e.start_at);
            return (
              <li
                key={e.id}
                className="flex items-center bg-neutral-700 rounded-lg overflow-hidden hover:bg-neutral-600 transition"
              >
                {/* Date strip */}
                <div className="flex flex-col items-center justify-center bg-neutral-600 px-2 py-3 min-w-[48px]">
                  <span className="text-[10px] uppercase text-gray-300 tracking-wide">
                    {date.toLocaleString("en-US", { month: "short" })}
                  </span>
                  <span className="text-lg font-bold text-white leading-none">
                    {date.getDate()}
                  </span>
                </div>

                {/* Title */}
                <Link
                  to="/events"
                  className="flex-1 px-3 py-2 text-sm font-medium text-brand-400 hover:underline truncate"
                  title={e.title}
                >
                  {e.title}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <Link
        to="/events"
        className="block text-sm text-brand-400 hover:underline mt-3"
      >
        See all events →
      </Link>
    </div>
  );
}
