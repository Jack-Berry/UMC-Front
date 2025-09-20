// src/redux/messagesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiFetch from "../api/apiClient";

// 🔹 Start a conversation (or fetch existing one)
export const startConversation = createAsyncThunk(
  "messages/startConversation",
  async (peerId, { rejectWithValue }) => {
    try {
      const res = await apiFetch("/api/msg/threads", {
        method: "POST",
        body: { peerId },
      });
      return res; // { id }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Load all messages for a thread
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (threadId, { rejectWithValue }) => {
    try {
      const res = await apiFetch(`/api/msg/threads/${threadId}/messages`, {
        method: "GET",
      });
      return { threadId, messages: res };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Fetch all threads
export const fetchThreads = createAsyncThunk(
  "messages/fetchThreads",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiFetch("/api/msg/threads");
      return res; // [{ id, created_at, participants }]
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// 🔹 Send a message to a thread
export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ threadId, text }, { rejectWithValue }) => {
    try {
      const res = await apiFetch(`/api/msg/threads/${threadId}/messages`, {
        method: "POST",
        body: { text },
      });
      return { threadId, message: res };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    threads: [], // [{ id, messages: [] }]
    activeThread: null,
    error: null,
    loading: false,
  },
  reducers: {
    setActiveThread: (state, action) => {
      state.activeThread = action.payload;
    },
    resetMessages: (state) => {
      state.threads = [];
      state.activeThread = null;
      state.error = null;
    },
    appendMessage: (state, action) => {
      const { threadId, message } = action.payload;
      let thread = state.threads.find((t) => t.id === threadId);
      if (!thread) {
        thread = { id: threadId, messages: [] };
        state.threads.push(thread);
      }
      thread.messages.push(message);
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Threads
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.threads = action.payload.map((t) => ({
          ...t,
          messages: state.threads.find((th) => th.id === t.id)?.messages || [],
        }));
      })
      // 🔹 Start conversation
      .addCase(startConversation.fulfilled, (state, action) => {
        const found = state.threads.find((t) => t.id === action.payload.id);
        if (!found) {
          state.threads.push({ id: action.payload.id, messages: [] });
        }
        state.activeThread = action.payload.id;
      })
      // 🔹 Fetch messages
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { threadId, messages } = action.payload;
        let thread = state.threads.find((t) => t.id === threadId);
        if (thread) {
          thread.messages = messages;
        } else {
          state.threads.push({ id: threadId, messages });
        }
      })
      // 🔹 Send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { threadId, message } = action.payload;
        let thread = state.threads.find((t) => t.id === threadId);
        if (!thread) {
          thread = { id: threadId, messages: [] };
          state.threads.push(thread);
        }
        thread.messages.push(message);
      })
      // 🔹 Generic loading/error handling
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || "Error";
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export const { setActiveThread, resetMessages, appendMessage } =
  messagesSlice.actions;
export default messagesSlice.reducer;
