// src/components/SidebarFriends.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchFriends,
  fetchRequests,
  acceptRequest,
  rejectRequest,
  markRequestsSeen,
  selectPresence,
  bulkSetPresence,
} from "../redux/friendsSlice";
import { startThread } from "../redux/messagesSlice";
import apiFetch from "../api/apiClient";
import { Bell, Check, X, MessageCircle } from "lucide-react";

const placeholder =
  "https://managingbarca.com/wp-content/uploads/2025/06/Pep-Guardiola.jpg";

export default function SidebarFriends() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const friends = useSelector((s) => s.friends.list) || [];
  const { incoming = [], requestsSeen } = useSelector((s) => s.friends);
  const presence = useSelector(selectPresence) || {}; // userId → boolean

  const [showRequests, setShowRequests] = useState(false);
  const pollTimer = useRef(null);

  // Initial data fetch (friends + requests)
  useEffect(() => {
    dispatch(fetchFriends());
    dispatch(fetchRequests());
  }, [dispatch]);

  // REST presence fallback: fetch on mount, whenever friends list changes, and every 30s.
  useEffect(() => {
    // Avoid empty queries
    const ids = friends.map((f) => f.id).filter(Boolean);
    if (ids.length === 0) return;

    let cancelled = false;

    const fetchPresence = async () => {
      try {
        // GET /api/users/presence?ids=1,2,3 returns { presence: { "1": true, "2": false, ... } }
        const res = await apiFetch(
          `/api/users/presence?ids=${encodeURIComponent(ids.join(","))}`
        );
        console.log("[SidebarFriends] presence API response:", res);
        if (!cancelled && res && res.presence) {
          dispatch(bulkSetPresence(res.presence));
        }
      } catch (err) {
        // Non-fatal: socket updates will still flow if configured
        console.warn("Presence fetch failed:", err?.message || err);
      }
    };

    // Kick off immediately…
    fetchPresence();

    // …and poll every 30s as a safety net
    clearInterval(pollTimer.current);
    pollTimer.current = setInterval(fetchPresence, 30_000);

    return () => {
      cancelled = true;
      clearInterval(pollTimer.current);
    };
  }, [friends, dispatch]);

  const handleMessage = async (peerId) => {
    try {
      await dispatch(startThread(peerId)).unwrap();
      navigate("/messages");
    } catch (e) {
      console.error("Failed to start conversation:", e);
      alert("Could not start a conversation. Please try again.");
    }
  };

  // Keep the UI compact: show top 5 friends here
  const topFriends = useMemo(() => friends.slice(0, 5), [friends]);

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
          aria-label="Friend requests"
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
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm">{req.name}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => dispatch(acceptRequest(req.request_id))}
                    className="p-1 bg-green-600 hover:bg-green-500 rounded text-white"
                    title="Accept"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => dispatch(rejectRequest(req.request_id))}
                    className="p-1 bg-red-600 hover:bg-red-500 rounded text-white"
                    title="Decline"
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

      {/* Top friends list with presence dot */}
      {topFriends.length === 0 ? (
        <p className="text-sm text-gray-400">No friends yet.</p>
      ) : (
        <ul className="space-y-2">
          {topFriends.map((f) => {
            const online = Boolean(presence?.[f.id]?.online);
            return (
              <li
                key={f.id}
                className="flex items-center justify-between text-sm bg-neutral-700/50 p-2 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {/* Presence dot */}
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${
                      online
                        ? "bg-green-500 ring-2 ring-green-300/40"
                        : "bg-neutral-500"
                    }`}
                    title={online ? "Online" : "Offline"}
                    aria-label={online ? "Online" : "Offline"}
                  />
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
            );
          })}
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
