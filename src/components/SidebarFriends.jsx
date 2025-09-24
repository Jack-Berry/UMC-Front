import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const placeholder =
  "https://managingbarca.com/wp-content/uploads/2025/06/Pep-Guardiola.jpg";

export default function SidebarFriends() {
  const friends = useSelector((s) => s.friends.list) || [];
  const topFriends = friends.slice(0, 5);

  return (
    <div className="bg-neutral-800 rounded-2xl shadow-md p-4 space-y-3">
      <h2 className="text-lg font-bold">Friends</h2>

      {topFriends.length === 0 ? (
        <p className="text-sm text-gray-400">No friends yet.</p>
      ) : (
        <ul className="space-y-2">
          {topFriends.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-3 text-sm bg-neutral-700/50 p-2 rounded-lg"
            >
              <img
                src={f.avatar_url || placeholder}
                alt={f.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-medium text-gray-200">{f.name}</span>
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/friends"
        className="block text-sm text-brand-400 hover:underline mt-2"
      >
        See all friends →
      </Link>
    </div>
  );
}
