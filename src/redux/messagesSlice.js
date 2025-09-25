// src/redux/messagesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiFetch from "../api/apiClient";

/**
 * Messaging state shape:
 * - threads: [{ id, participants?, lastMessage?, messages: [] }]
 * - activeThread: threadId
 *
 * Backend endpoints:
 *   GET  /api/msg/threads
 *   POST /api/msg/threads                { peerId }  -> { id, ... } (upsert)
 *   GET  /api/msg/threads/:id/messages
 *   POST /api/msg/threads/:id/messages   { text }    -> { id, text, ... }
 */

/** Create or fetch an existing 1:1 thread with a peer user. */
export const startThread = createAsyncThunk(
  "messages/startThread",
  async (peerId, { rejectWithValue }) => {
    try {
      const res = await apiFetch("/api/msg/threads", {
        method: "POST",
        body: { peerId },
      });
      if (!res || !res.id) throw new Error("No thread id returned");
      return res; // { id, ... }
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
  async ({ threadId, text }, { rejectWithValue }) => {
    try {
      if (!threadId) throw new Error("threadId is required");
      const res = await apiFetch(`/api/msg/threads/${threadId}/messages`, {
        method: "POST",
        body: { text },
      });
      return { threadId, message: res };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to send message");
    }
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    threads: [], // [{ id, messages: [] }]
    activeThread: null, // threadId
    loading: false,
    error: null,
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
    },
    /** Allow sockets to inject a new message. Accepts { threadId, message }. */
    appendMessage: (state, action) => {
      const { threadId, message } = action.payload;
      if (!threadId || !message) return;

      let thread = state.threads.find((t) => String(t.id) === String(threadId));
      if (!thread) {
        thread = { id: threadId, messages: [] };
        state.threads.push(thread);
      }
      thread.messages = [...(thread.messages || []), message];
    },
  },
  extraReducers: (builder) => {
    builder
      // Load threads
      .addCase(fetchThreads.fulfilled, (state, action) => {
        const incoming = action.payload || [];
        // Preserve messages already loaded
        state.threads = incoming.map((t) => ({
          ...t,
          messages:
            state.threads.find((x) => String(x.id) === String(t.id))
              ?.messages || [],
        }));
        // If nothing selected, auto-select first so existing threads render
        if (!state.activeThread && state.threads.length > 0) {
          state.activeThread = state.threads[0].id;
        }
        state.loading = false;
        state.error = null;
      })

      // Start (upsert) a thread; make it active
      .addCase(startThread.fulfilled, (state, action) => {
        const thread = action.payload;
        let existing = state.threads.find(
          (t) => String(t.id) === String(thread.id)
        );
        if (!existing) {
          existing = { ...thread, messages: [] };
          state.threads.push(existing);
        }
        state.activeThread = existing.id;
        state.loading = false;
        state.error = null;
      })

      // Load messages
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
        state.error = null;
      })

      // Send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { threadId, message } = action.payload;
        let thread = state.threads.find(
          (t) => String(t.id) === String(threadId)
        );
        if (!thread) {
          thread = { id: threadId, messages: [] };
          state.threads.push(thread);
        }
        thread.messages = [...(thread.messages || []), message];
        state.loading = false;
        state.error = null;
      })

      // Generic pending/rejected
      .addMatcher(
        (action) =>
          action.type.startsWith("messages/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("messages/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || "Error";
        }
      );
  },
});

export const { setActiveThread, resetMessages, appendMessage } =
  messagesSlice.actions;
export default messagesSlice.reducer;
