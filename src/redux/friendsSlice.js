import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiFetch from "../api/apiClient";

// --- Async thunks ---
export const fetchFriends = createAsyncThunk(
  "friends/fetchFriends",
  async (_, { rejectWithValue }) => {
    try {
      return await apiFetch("/api/friends");
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchRequests = createAsyncThunk(
  "friends/fetchRequests",
  async (_, { rejectWithValue }) => {
    try {
      return await apiFetch("/api/friends/pending");
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const searchUsersByEmail = createAsyncThunk(
  "friends/searchUsersByEmail",
  async (email, { rejectWithValue }) => {
    try {
      return await apiFetch(
        `/api/users/search?email=${encodeURIComponent(email)}`
      );
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const sendRequest = createAsyncThunk(
  "friends/sendRequest",
  async (userId, { rejectWithValue }) => {
    try {
      return await apiFetch(`/api/friends/${userId}/request`, {
        method: "POST",
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const acceptRequest = createAsyncThunk(
  "friends/acceptRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      return await apiFetch(`/api/friends/${requestId}/accept`, {
        method: "POST",
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const rejectRequest = createAsyncThunk(
  "friends/rejectRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      return await apiFetch(`/api/friends/${requestId}/decline`, {
        method: "POST",
      });
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
  },
  reducers: {
    markRequestsSeen: (state) => {
      state.requestsSeen = true;
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
export const { markRequestsSeen } = friendsSlice.actions;

export default friendsSlice.reducer;
