// src/redux/matchesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../api/apiClient";

// 🔹 Fetch suggested matches
export const fetchMatches = createAsyncThunk(
  "matches/fetchMatches",
  async ({ distanceKm = 50, minScore = 80 } = {}, { rejectWithValue }) => {
    try {
      const res = await apiClient(
        `/api/matches?distanceKm=${distanceKm}&minScore=${minScore}`,
        { method: "GET" }
      );

      // Normalize to ensure display_name
      const normalized = (res.matches || []).map((m) => ({
        ...m,
        display_name: m.display_name || m.first_name,
      }));
      return normalized;
    } catch (err) {
      console.error("fetchMatches error:", err);
      return rejectWithValue(err.message || "Fetch failed");
    }
  }
);

// 🔹 Search matches by tag
export const searchMatches = createAsyncThunk(
  "matches/searchMatches",
  async ({ tag, distanceKm = 50 }, { rejectWithValue }) => {
    try {
      const res = await apiClient(
        `/api/matches/search?tag=${encodeURIComponent(
          tag
        )}&distanceKm=${distanceKm}`,
        { method: "GET" }
      );

      // Normalize to ensure display_name
      const normalized = (res.matches || []).map((m) => ({
        ...m,
        display_name: m.display_name || m.first_name,
      }));
      return normalized;
    } catch (err) {
      console.error("searchMatches error:", err);
      return rejectWithValue(err.message || "Search failed");
    }
  }
);

const matchesSlice = createSlice({
  name: "matches",
  initialState: {
    items: [],
    searchItems: [],
    loading: false,
    error: null,
    lastSearchTag: null,
  },
  reducers: {
    clearMatches: (state) => {
      state.items = [];
      state.error = null;
      state.loading = false;
      state.lastSearchTag = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMatches
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch matches";
      })
      // searchMatches
      .addCase(searchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.searchItems = action.payload || [];
        state.lastSearchTag = action.meta.arg.tag;
      })
      .addCase(searchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to search matches";
      });
  },
});

export const { clearMatches } = matchesSlice.actions;

export default matchesSlice.reducer;
