// src/components/Messages.jsx
import { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchThreads,
  fetchMessages,
  sendMessage,
  setActiveThread,
} from "../redux/messagesSlice";
import { getUserById } from "../api/users"; // ✅ fallback API call
import UserCard from "../components/UserCard";
import Crest from "../assets/Crest.png";
import { ArrowDown } from "lucide-react";

const placeholder =
  "https://managingbarca.com/wp-content/uploads/2025/06/Pep-Guardiola.jpg";

export default function Messages() {
  const dispatch = useDispatch();

  const user = useSelector((s) => s.user.current);
  const { threads, activeThread, loading, error } = useSelector(
    (s) => s.messages
  );
  const friends = useSelector((s) => s.friends.list) || [];
  const matches = useSelector((s) => s.matches.items) || [];

  const [text, setText] = useState("");

  // Refs for scroll control
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Cache of resolved participants per thread: { [threadId]: { id, name, avatar } }
  const [participantsMap, setParticipantsMap] = useState({});

  // Load all threads on mount
  useEffect(() => {
    dispatch(fetchThreads());
  }, [dispatch]);

  // Load messages when active thread changes
  useEffect(() => {
    if (!activeThread) return;
    dispatch(fetchMessages(activeThread));
  }, [dispatch, activeThread]);

  // Track scroll position → show “Recent” button when away from bottom
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
      setShowScrollButton(!atBottom);
    };

    el.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  // ---------- Participant resolution helpers ----------
  const resolveOtherForThread = async (thread) => {
    if (!thread?.participants || !user?.id) return null;

    const arr = thread.participants;

    if (arr.length && typeof arr[0] === "object") {
      const otherObj = arr.find((p) => String(p.id) !== String(user.id));
      if (!otherObj) return null;

      const f = friends.find((fr) => String(fr.id) === String(otherObj.id));
      if (f) return { id: f.id, name: f.name, avatar: f.avatar_url || Crest };

      const m = matches.find((mm) => String(mm.id) === String(otherObj.id));
      if (m) return { id: m.id, name: m.name, avatar: m.avatar || Crest };

      try {
        const u = await getUserById(otherObj.id);
        return { id: u.id, name: u.name, avatar: u.avatar_url || Crest };
      } catch {
        return {
          id: otherObj.id,
          name: otherObj.name || `User ${otherObj.id}`,
          avatar: Crest,
        };
      }
    }

    const otherId = arr.find((pid) => String(pid) !== String(user.id));
    if (!otherId) return null;

    const f = friends.find((fr) => String(fr.id) === String(otherId));
    if (f) return { id: f.id, name: f.name, avatar: f.avatar_url || Crest };

    const m = matches.find((mm) => String(mm.id) === String(otherId));
    if (m) return { id: m.id, name: m.name, avatar: m.avatar || Crest };

    try {
      const u = await getUserById(otherId);
      return { id: u.id, name: u.name, avatar: u.avatar_url || Crest };
    } catch {
      return { id: otherId, name: `User ${otherId}`, avatar: Crest };
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fillMissingParticipants = async () => {
      if (!threads?.length) return;
      const updates = {};
      for (const t of threads) {
        if (!participantsMap[t.id]) {
          updates[t.id] = await resolveOtherForThread(t);
        }
      }
      if (!cancelled && Object.keys(updates).length) {
        setParticipantsMap((prev) => ({ ...prev, ...updates }));
      }
    };

    fillMissingParticipants();
    return () => {
      cancelled = true;
    };
  }, [threads, friends, matches]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentThread = useMemo(
    () => threads.find((t) => String(t.id) === String(activeThread)),
    [threads, activeThread]
  );
  const otherUser = currentThread ? participantsMap[currentThread.id] : null;

  // Auto-scroll when YOU send a message OR when at bottom already
  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el || !currentThread) return;

    const msgs = currentThread.messages || [];
    if (msgs.length === 0) return;

    const last = msgs[msgs.length - 1];
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;

    if (atBottom || String(last.senderId) === String(user?.id)) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentThread, user?.id]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !activeThread) return;
    dispatch(sendMessage({ threadId: activeThread, text }));
    setText("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex-1 w-full flex h-[84vh] bg-neutral-900 text-white rounded-lg overflow-hidden shadow-lg">
      {/* Sidebar - Threads List */}
      <div className="w-64 bg-neutral-900 border-r border-neutral-700 flex-shrink-0 overflow-y-auto">
        <h2 className="text-lg font-bold p-4 border-b border-neutral-700">
          Messages
        </h2>
        {loading && <p className="p-4 text-gray-400">Loading…</p>}
        {error && <p className="p-4 text-red-400">{error}</p>}
        {threads.length === 0 && !loading && (
          <p className="p-4 text-gray-400">No conversations yet.</p>
        )}
        <ul className="space-y-1">
          {threads.map((t) => {
            const other = participantsMap[t.id];
            return (
              <li key={t.id}>
                <button
                  onClick={() => dispatch(setActiveThread(t.id))}
                  className={`w-full flex items-center gap-3 p-3 text-left ${
                    activeThread === t.id
                      ? "bg-neutral-800"
                      : "hover:bg-neutral-800"
                  }`}
                >
                  <img
                    src={(other && other.avatar) || placeholder}
                    alt={(other && other.name) || "User"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 truncate">
                    <p className="font-medium text-white">
                      {(other && other.name) || "User"}
                    </p>
                    {t.lastMessage && (
                      <p className="text-xs text-gray-400 truncate">
                        {t.lastMessage.text}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Main panel */}
      <div className="flex-1 flex flex-col bg-neutral-900 border-l border-neutral-700">
        {activeThread && currentThread ? (
          <>
            <div className="border-b border-neutral-700 px-4 pb-4 pt-0">
              <UserCard
                id={otherUser?.id}
                name={otherUser?.name}
                avatar={otherUser?.avatar || Crest}
                variant="friend"
              />
            </div>

            <div className="relative flex-1 max-h-[52vh]">
              <div
                ref={messagesContainerRef}
                className="h-full overflow-y-auto p-4 space-y-3"
              >
                {(currentThread.messages || []).map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${
                      String(m.senderId) === String(user?.id)
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-lg max-w-xs break-words ${
                        String(m.senderId) === String(user?.id)
                          ? "bg-brand-600 text-white"
                          : "bg-neutral-700 text-gray-100"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {showScrollButton && (
                <button
                  onClick={scrollToBottom}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 
                 bg-brand-600 hover:bg-brand-500 text-white 
                 p-2 rounded-full shadow-lg"
                  title="Scroll to latest"
                >
                  <ArrowDown className="w-5 h-5" />
                </button>
              )}
            </div>

            <form
              onSubmit={handleSend}
              className="p-4 border-t border-neutral-700 flex gap-2"
            >
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 px-3 py-2 rounded bg-neutral-800 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 rounded text-white"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
