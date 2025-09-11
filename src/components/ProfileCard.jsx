// src/components/ProfileCard.jsx
import { useSelector } from "react-redux";

export default function ProfileCard() {
  const user = useSelector((state) => state.user.current);

  return (
    <div className="bg-neutral-800 p-6 rounded-lg shadow-md space-y-6">
      {/* Avatar + name */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center text-2xl font-bold">
          {user?.name?.[0] || "?"}
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{user?.name}</h2>
          <p className="text-gray-400 text-sm">Member since 2025</p>
        </div>
      </div>

      {/* Useful / Useless fields */}
      <div>
        <h3 className="text-lg font-semibold mb-2">About Me</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-700 p-3 rounded">
            <p className="text-sm text-gray-400">I am useful at:</p>
            <p className="text-white font-medium">
              {user?.useful_at || "⚒️ Not set yet"}
            </p>
          </div>
          <div className="bg-gray-700 p-3 rounded">
            <p className="text-sm text-gray-400">I am useless at:</p>
            <p className="text-white font-medium">
              {user?.useless_at || "🤷 Not set yet"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
