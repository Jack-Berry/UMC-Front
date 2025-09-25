import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchFriends,
  fetchRequests,
  acceptRequest,
  rejectRequest,
  markRequestsSeen,
} from "../redux/friendsSlice";
import { setActiveThread } from "../redux/messagesSlice";
import { Bell, Check, X, MessageCircle } from "lucide-react";

const placeholder =
  "https://managingbarca.com/wp-content/uploads/2025/06/Pep-Guardiola.jpg";

export default function SidebarFriends() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const friends = useSelector((s) => s.friends.list) || [];
  const { incoming = [], requestsSeen } = useSelector((s) => s.friends);

  const [showRequests, setShowRequests] = useState(false);

  useEffect(() => {
    dispatch(fetchFriends());
    dispatch(fetchRequests());
  }, [dispatch]);

  const handleMessage = (id) => {
    dispatch(setActiveThread(id));
    navigate("/messages");
  };

  const topFriends = friends.slice(0, 5);

  return (
    <div className="bg-neutral-800 rounded-2xl shadow-md p-4 space-y-3 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Friends</h2>

        {/* Friend Requests Bell */}
        <button
          onClick={() => {
            setShowRequests((s) => !s);
            dispatch(markRequestsSeen());
          }}
          className={`relative p-2 hover:bg-neutral-700 transition ${
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
      </div>

      {/* Requests dropdown */}
      {showRequests && (
        <div className="absolute right-4 top-12 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg w-72 z-50 p-4 space-y-3">
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

      {/* Top friends list */}
      {topFriends.length === 0 ? (
        <p className="text-sm text-gray-400">No friends yet.</p>
      ) : (
        <ul className="space-y-2">
          {topFriends.map((f) => (
            <li
              key={f.id}
              className="flex items-center justify-between text-sm bg-neutral-700/50 p-2 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <img
                  src={f.avatar_url || placeholder}
                  alt={f.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium text-gray-200">{f.name}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleMessage(f.id)}
                  className="p-1 bg-neutral-600 hover:bg-neutral-500 rounded-full"
                  title="Message"
                >
                  <MessageCircle size={16} className="text-white" />
                </button>
              </div>
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
