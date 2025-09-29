// src/components/FriendsList.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { startThread } from "../redux/messagesSlice";
import {
  fetchFriends,
  fetchRequests,
  acceptRequest,
  rejectRequest,
  sendRequest,
  searchUsersByEmail,
  selectFriends,
  selectFriendsStatus,
  markRequestsSeen,
  removeFriend,
  selectPresence,
} from "../redux/friendsSlice";
import UserCard from "./UserCard";
import Crest from "../assets/Crest.png";
import AddFriendModal from "./AddFriendModal";
import { UserPlus, Bell, Check, X, MessageCircle } from "lucide-react";

const placeholder =
  "https://managingbarca.com/wp-content/uploads/2025/06/Pep-Guardiola.jpg";

export default function FriendsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const friends = useSelector(selectFriends);
  const status = useSelector(selectFriendsStatus);
  const presence = useSelector(selectPresence); // 🔹 presence map from Redux
  const { error, incoming = [], requestsSeen } = useSelector((s) => s.friends);

  const [page, setPage] = useState(1);
  const [showRequests, setShowRequests] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const limit = 6;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchFriends());
      dispatch(fetchRequests());
    }
  }, [status, dispatch]);

  // Client-side pagination
  const startIndex = (page - 1) * limit;
  const currentPageFriends = friends.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(friends.length / limit);

  // ✅ Search user by email → send friend request
  const handleAddFriend = async (email) => {
    try {
      const result = await dispatch(searchUsersByEmail(email)).unwrap();
      if (result.length > 0) {
        const userId = result[0].id;
        dispatch(sendRequest(userId));
        setShowAddModal(false);
      } else {
        alert("No user found with that email.");
      }
    } catch (err) {
      console.error("Error searching user:", err);
      alert("Failed to search user.");
    }
  };

  const handleMessage = async (peerId) => {
    try {
      await dispatch(startThread(peerId)).unwrap();
      navigate("/messages");
    } catch (e) {
      console.error("Failed to start conversation:", e);
      alert("Could not start a conversation. Please try again.");
    }
  };

  const handleRemove = (id) => {
    if (window.confirm("Remove this friend?")) {
      dispatch(removeFriend(id));
    }
  };

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
    <div className="bg-neutral-800 p-6 rounded-lg shadow-md space-y-4 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Friends</h2>

        <div className="flex items-center gap-3">
          {/* Friend requests bell */}
          <button
            onClick={() => {
              setShowRequests((s) => !s);
              dispatch(markRequestsSeen());
            }}
            className={`relative p-2 hover:bg-neutral-700 transition
              ${
                incoming.length > 0 && !requestsSeen
                  ? "border-2 border-red-500 rounded-full animate-wiggle"
                  : "rounded-full"
              }`}
          >
            <Bell className="w-5 h-5 text-gray-300" />
            {incoming.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs font-bold text-white rounded-full px-1.5">
                {incoming.length}
              </span>
            )}
          </button>

          {/* Add Friend Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 rounded bg-brand-600 hover:bg-brand-500 text-white flex items-center gap-1"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Friend</span>
          </button>
        </div>
      </div>

      {/* Slide-out Friend Requests */}
      {showRequests && (
        <div className="absolute right-4 top-14 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg w-72 z-50 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-200 mb-2">
            Friend Requests
          </h3>
          {incoming.length ? (
            incoming.map((req) => (
              <div
                key={req.request_id || req.id}
                className="flex items-center justify-between bg-neutral-800 p-2 rounded"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={req.avatar_url || placeholder}
                    alt={req.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm">{req.name}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => dispatch(acceptRequest(req.request_id))}
                    className="p-1 bg-green-600 hover:bg-green-500 rounded text-white"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => dispatch(rejectRequest(req.request_id))}
                    className="p-1 bg-red-600 hover:bg-red-500 rounded text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400">No requests right now.</p>
          )}
        </div>
      )}

      {/* Friends grid */}
      {currentPageFriends.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentPageFriends.map((f) => (
            <UserCard
              key={f.id}
              id={f.id}
              name={f.name}
              avatar={f.avatar || Crest}
              variant="friend"
              online={presence[f.id]?.online || false}
              actions={[
                <button
                  key="msg"
                  onClick={() => handleMessage(f.id)}
                  className="p-1 bg-gray-600 hover:bg-gray-500 rounded-full"
                  title="Message"
                >
                  <MessageCircle size={18} className="text-white" />
                </button>,
                <button
                  key="remove"
                  onClick={() => handleRemove(f.id)}
                  className="p-1 bg-neutral-600 hover:bg-neutral-500 rounded-full"
                  title="Remove Friend"
                >
                  <X size={18} className="text-white" />
                </button>,
              ]}
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

      {/* Add Friend Modal */}
      <AddFriendModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddFriend}
      />
    </div>
  );
}
