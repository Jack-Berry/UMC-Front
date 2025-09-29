import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiFetch from "../api/apiClient";

/**
 * Messaging state shape:
 * - threads: [{ id, participants?, messages: [] }]
 * - activeThread: threadId
 * - unreadCounts: { [threadId]: number }
 */

// ---------- Async thunks ----------

/** Create or fetch an existing 1:1 thread with a peer user. */
export const startThread = createAsyncThunk(
  "messages/startThread",
  async ({ peerId, matchToken }, { getState, rejectWithValue }) => {
    try {
      const res = await apiFetch("/api/msg/threads", {
        method: "POST",
        body: { peerId, matchToken },
      });
      if (!res || !res.id) throw new Error("No thread id returned");

      const state = getState();
      const friends = state.friends?.list || [];
      const friend = friends.find((f) => String(f.id) === String(peerId));

      let peerData = friend
        ? { id: friend.id, name: friend.name, avatar: friend.avatar_url }
        : null;

      // 🔹 Fallback → fetch user if not in friends
      if (!peerData) {
        try {
          const userRes = await apiFetch(`/api/users/${peerId}`, {
            method: "GET",
          });
          peerData = {
            id: userRes.id,
            name: userRes.name,
            avatar: userRes.avatar_url,
          };
        } catch {
          peerData = { id: peerId, name: "Unknown User", avatar: null };
        }
      }

      return {
        ...res,
        participants: [
          { id: state.user.current?.id, ...state.user.current },
          peerData,
        ],
      };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to start thread");
    }
  }
);

/** Fetch all threads for the current user. */
export const fetchThreads = createAsyncThunk(
  "messages/fetchThreads",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiFetch("/api/msg/threads", { method: "GET" });
      return Array.isArray(res) ? res : [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load threads");
    }
  }
);

/** Fetch messages for a given threadId. */
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (threadId, { rejectWithValue }) => {
    try {
      const res = await apiFetch(`/api/msg/threads/${threadId}/messages`, {
        method: "GET",
      });
      return { threadId, messages: Array.isArray(res) ? res : [] };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load messages");
    }
  }
);

/** Send a message. Accepts { threadId, text }. */
export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ threadId, text }, { getState, rejectWithValue }) => {
    try {
      if (!threadId) throw new Error("threadId is required");

      const state = getState();
      const senderId = state.user.current?.id;

      // Optimistic append
      const tempMessage = {
        id: `temp-${Date.now()}`,
        senderId,
        text,
        createdAt: new Date().toISOString(),
        conversationId: threadId,
      };

      return await apiFetch(`/api/msg/threads/${threadId}/messages`, {
        method: "POST",
        body: { text },
      }).then((res) => ({ threadId, message: res, optimistic: tempMessage }));
    } catch (err) {
      return rejectWithValue(err.message || "Failed to send message");
    }
  }
);

/** Mark thread as read. Clears unread count. */
export const markThreadRead = createAsyncThunk(
  "messages/markThreadRead",
  async ({ threadId, lastReadMsgId }, { rejectWithValue }) => {
    try {
      await apiFetch(`/api/msg/threads/${threadId}/read`, {
        method: "PUT",
        body: { lastReadMsgId },
      });
      return { threadId };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to mark read");
    }
  }
);

// ---------- Slice ----------

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    threads: [],
    activeThread: null,
    loading: false,
    error: null,
    unreadCounts: {},
  },
  reducers: {
    setActiveThread: (state, action) => {
      state.activeThread = action.payload;
    },
    resetMessages: (state) => {
      state.threads = [];
      state.activeThread = null;
      state.error = null;
      state.loading = false;
      state.unreadCounts = {};
    },
    appendMessage: (state, action) => {
      const { threadId, message, currentUserId } = action.payload;
      if (!threadId || !message) return;

      let thread = state.threads.find((t) => String(t.id) === String(threadId));
      if (!thread) {
        thread = { id: threadId, messages: [] };
        state.threads.push(thread);
      }

      // ✅ Skip echo if it's the sender's own message
      if (String(message.senderId) === String(currentUserId)) return;

      const exists = thread.messages.some(
        (m) => String(m.id) === String(message.id)
      );
      if (!exists) {
        thread.messages.push(message);
      }
    },

    incrementUnread: (state, action) => {
      const { threadId } = action.payload;
      state.unreadCounts[threadId] = (state.unreadCounts[threadId] || 0) + 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.fulfilled, (state, action) => {
        const incoming = action.payload || [];
        state.threads = incoming.map((t) => ({
          ...t,
          messages:
            state.threads.find((x) => String(x.id) === String(t.id))
              ?.messages || [],
        }));
        state.unreadCounts = incoming.reduce((acc, t) => {
          acc[t.id] = t.unreadCount || 0;
          return acc;
        }, {});
        state.loading = false;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { threadId, messages } = action.payload;
        let thread = state.threads.find(
          (t) => String(t.id) === String(threadId)
        );
        if (!thread) {
          thread = { id: threadId, messages: [] };
          state.threads.push(thread);
        }
        thread.messages = messages;
        state.loading = false;
      })
      .addCase(sendMessage.pending, (state, action) => {
        const { arg } = action.meta;
        const tempMsg = {
          id: `temp-${Date.now()}`,
          senderId: state.user?.current?.id,
          text: arg.text,
          createdAt: new Date().toISOString(),
          conversationId: arg.threadId,
        };
        const thread = state.threads.find(
          (t) => String(t.id) === String(arg.threadId)
        );
        if (thread) thread.messages.push(tempMsg);
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { threadId, message } = action.payload;
        const thread = state.threads.find(
          (t) => String(t.id) === String(threadId)
        );
        if (thread) {
          thread.messages = thread.messages.filter(
            (m) => !String(m.id).startsWith("temp-")
          );
          thread.messages.push(message);
        }
        state.loading = false;
      })
      .addCase(markThreadRead.fulfilled, (state, action) => {
        const { threadId } = action.payload;
        state.unreadCounts[threadId] = 0;
      });
  },
});

export const {
  setActiveThread,
  resetMessages,
  appendMessage,
  incrementUnread,
} = messagesSlice.actions;

export default messagesSlice.reducer;
