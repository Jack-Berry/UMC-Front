// src/redux/friendsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiFetch from "../api/apiClient";

// --- Async thunks ---
export const fetchFriends = createAsyncThunk(
  "friends/fetchFriends",
  async (_, { rejectWithValue }) => {
    try {
      const friends = await apiFetch("/api/friends");
      // 🔹 Normalize to include display_name
      return friends.map((f) => ({
        ...f,
        display_name: f.display_name || f.first_name,
      }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchRequests = createAsyncThunk(
  "friends/fetchRequests",
  async (_, { rejectWithValue }) => {
    try {
      const requests = await apiFetch("/api/friends/pending");
      return requests.map((r) => ({
        ...r,
        display_name: r.display_name || r.first_name,
      }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const searchUsersByEmail = createAsyncThunk(
  "friends/searchUsersByEmail",
  async (email, { rejectWithValue }) => {
    try {
      const users = await apiFetch(
        `/api/users/search?email=${encodeURIComponent(email)}`
      );
      return users.map((u) => ({
        ...u,
        display_name: u.display_name || u.first_name,
      }));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const sendRequest = createAsyncThunk(
  "friends/sendRequest",
  async (userId, { rejectWithValue }) => {
    try {
      const req = await apiFetch(`/api/friends/${userId}/request`, {
        method: "POST",
      });
      return req
        ? { ...req, display_name: req.display_name || req.first_name }
        : null;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const acceptRequest = createAsyncThunk(
  "friends/acceptRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      const res = await apiFetch(`/api/friends/${requestId}/accept`, {
        method: "POST",
      });
      if (res?.friend) {
        return {
          ...res,
          friend: {
            ...res.friend,
            display_name: res.friend.display_name || res.friend.first_name,
          },
        };
      }
      return res;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const rejectRequest = createAsyncThunk(
  "friends/rejectRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      await apiFetch(`/api/friends/${requestId}/decline`, {
        method: "POST",
      });
      return requestId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeFriend = createAsyncThunk(
  "friends/removeFriend",
  async (userId, { rejectWithValue }) => {
    try {
      await apiFetch(`/api/friends/${userId}/remove`, { method: "DELETE" });
      return userId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// --- Slice ---
const friendsSlice = createSlice({
  name: "friends",
  initialState: {
    list: [],
    incoming: [],
    outgoing: [],
    searchResults: [],
    status: "idle",
    error: null,
    requestsSeen: false,
    presence: {}, // 🔹 userId → boolean (online/offline)
  },
  reducers: {
    markRequestsSeen: (state) => {
      state.requestsSeen = true;
    },
    setPresence: (state, action) => {
      const { userId, online } = action.payload;
      console.log("[setPresence] update:", { userId, online });
      state.presence[userId] = online;
    },
    bulkSetPresence: (state, action) => {
      console.log("[bulkSetPresence] presence payload:", action.payload);
      state.presence = { ...state.presence, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload || [];
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      .addCase(fetchRequests.fulfilled, (state, action) => {
        state.incoming = action.payload || [];
        if ((action.payload || []).length > 0) {
          state.requestsSeen = false;
        }
      })

      .addCase(searchUsersByEmail.fulfilled, (state, action) => {
        state.searchResults = action.payload || [];
      })

      .addCase(sendRequest.fulfilled, (state, action) => {
        if (action.payload) state.outgoing.push(action.payload);
      })

      .addCase(acceptRequest.fulfilled, (state, action) => {
        if (action.payload?.friend) {
          state.list.push(action.payload.friend);
          state.incoming = state.incoming.filter(
            (r) => r.request_id !== action.meta.arg
          );
        }
      })

      .addCase(rejectRequest.fulfilled, (state, action) => {
        state.incoming = state.incoming.filter(
          (r) => r.request_id !== action.meta.arg
        );
      })

      .addCase(removeFriend.fulfilled, (state, action) => {
        state.list = state.list.filter((f) => f.id !== action.payload);
      });
  },
});

// --- Selectors ---
export const selectFriends = (state) => state.friends.list;
export const selectFriendsStatus = (state) => state.friends.status;
export const selectFriendRequests = (state) => ({
  incoming: state.friends.incoming,
  outgoing: state.friends.outgoing,
});
export const selectSearchResults = (state) => state.friends.searchResults;
export const selectPresence = (state) => state.friends.presence;

export const { markRequestsSeen, setPresence, bulkSetPresence } =
  friendsSlice.actions;

export default friendsSlice.reducer;
