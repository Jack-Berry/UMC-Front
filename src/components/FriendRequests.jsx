// src/components/FriendsList.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserCard from "./UserCard";
import {
  fetchFriends,
  selectFriends,
  selectFriendsStatus,
} from "../redux/friendsSlice";

const placeholder =
  "https://managingbarca.com/wp-content/uploads/2025/06/Pep-Guardiola.jpg";

export default function FriendsList() {
  const dispatch = useDispatch();
  const friends = useSelector(selectFriends);
  const status = useSelector(selectFriendsStatus);
  const { error } = useSelector((s) => s.friends);

  const [page, setPage] = useState(1);
  const limit = 6;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchFriends());
    }
  }, [status, dispatch]);

  // Client-side pagination
  const startIndex = (page - 1) * limit;
  const currentPageFriends = friends.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(friends.length / limit);

  if (status === "loading") {
    return (
      <div className="bg-neutral-800 p-6 rounded-lg shadow-md">
        <p className="text-gray-400">Loading friends…</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="bg-neutral-800 p-6 rounded-lg shadow-md">
        <p className="text-red-400">Failed to load friends. {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-800 p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-bold">Friends</h2>

      {currentPageFriends.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentPageFriends.map((f) => (
            <UserCard
              key={f.id}
              name={f.name}
              online={f.online}
              avatar={f.avatar_url || placeholder}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">You have no friends yet.</p>
      )}

      {/* Pagination */}
      {friends.length > limit && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-slate-700 text-sm disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-400">
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="px-3 py-1 rounded bg-slate-700 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
