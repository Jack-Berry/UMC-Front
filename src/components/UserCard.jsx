// src/components/UserCard.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { removeFriend } from "../redux/friendsSlice";
import { Trash2 } from "lucide-react";

const DEFAULT_PLACEHOLDER =
  "https://managingbarca.com/wp-content/uploads/2025/06/Pep-Guardiola.jpg";

export default function UserCard({
  id,
  name,
  avatar,
  online, // optional (friends)
  useful, // optional (matches)
  useless, // optional (matches)
  placeholder, // optional custom fallback
  className = "",
  isFriendCard = false, // 🔹 NEW: only true when used in FriendsList
}) {
  const dispatch = useDispatch();
  const imgSrc = avatar || placeholder || DEFAULT_PLACEHOLDER;

  return (
    <div
      className={`bg-gray-700 rounded-lg p-4 flex flex-col items-center shadow
                  hover:bg-gray-600 hover:scale-105 hover:shadow-lg
                  transition-transform duration-200 min-h-[200px] relative ${className}`}
    >
      {/* Avatar */}
      <img
        src={imgSrc}
        alt={`${name}'s avatar`}
        className="w-16 h-16 rounded-full object-cover mb-3 border-2 border-neutral-600"
        loading="lazy"
      />

      {/* Name + tiny status dot */}
      <p className="font-medium text-white flex items-center gap-2">
        {name}
        {online !== undefined && (
          <span
            aria-label={online ? "online" : "offline"}
            className={`w-2 h-2 rounded-full ${
              online ? "bg-green-400" : "bg-gray-500"
            }`}
          />
        )}
      </p>

      {/* Small status text (friends) */}
      {online !== undefined && (
        <p className={`text-xs ${online ? "text-green-400" : "text-gray-400"}`}>
          {online ? "Online" : "Offline"}
        </p>
      )}

      {/* Skills (matches) */}
      {(useful !== undefined || useless !== undefined) && (
        <div className="mt-3 w-full flex flex-col items-center gap-2">
          <span
            className="px-2 py-1 rounded-full text-xs font-medium
                           bg-green-700 text-green-200"
          >
            Useful: {useful || "—"}
          </span>
          <span
            className="px-2 py-1 rounded-full text-xs font-medium
                           bg-red-700 text-red-200"
          >
            Useless: {useless || "—"}
          </span>
        </div>
      )}

      {/* 🔹 Delete Friend Button (only in FriendsList) */}
      {isFriendCard && id && (
        <button
          onClick={() => dispatch(removeFriend(id))}
          className="absolute top-2 right-2 p-1 rounded-full bg-neutral-700 hover:bg-red-600 text-gray-300 hover:text-white transition"
          title="Remove Friend"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
