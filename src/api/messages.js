// src/api/messages.js
import apiFetch from "./apiClient";

// Fetch all threads
export function fetchThreads() {
  return apiFetch("/api/msg/threads", {
    method: "GET",
  });
}

// Fetch messages in a thread
export function fetchMessages(threadId) {
  return apiFetch(`/api/msg/threads/${threadId}/messages`, {
    method: "GET",
  });
}

// Send a message
export function sendMessage(threadId, text) {
  return apiFetch(`/api/msg/threads/${threadId}/messages`, {
    method: "POST",
    body: { text },
  });
}

// Start (or fetch existing) thread
// messagesSlice.js
export const startThread = createAsyncThunk(
  "messages/startThread",
  async ({ peerId, matchToken }, { getState, rejectWithValue }) => {
    try {
      // ✅ force peerId to be an integer
      const numericPeerId = parseInt(peerId, 10);

      const res = await apiFetch("/api/msg/threads", {
        method: "POST",
        body: { peerId: numericPeerId, matchToken },
      });
      if (!res || !res.id) throw new Error("No thread id returned");

      // 🔹 Enrich with participants immediately from friends list
      const state = getState();
      const friends = state.friends?.list || [];
      const friend = friends.find(
        (f) => String(f.id) === String(numericPeerId)
      );

      return {
        ...res,
        participants: [
          { id: state.user.current?.id, ...state.user.current },
          friend
            ? { id: friend.id, name: friend.name, avatar: friend.avatar_url }
            : { id: numericPeerId, name: "Unknown User", avatar: null },
        ],
      };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to start thread");
    }
  }
);
