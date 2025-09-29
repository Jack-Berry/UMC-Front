// src/redux/eventsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiFetch from "../api/apiClient";

// 🔹 Fetch all events (public, optionally sorted by distance)
export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async ({ lat, lng } = {}, { rejectWithValue }) => {
    try {
      const query = lat && lng ? `?lat=${lat}&lng=${lng}` : "";
      const res = await apiFetch(`/api/events${query}`);
      return res;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch events");
    }
  }
);

// 🔹 Fetch events user is registered for (protected)
export const fetchUserEvents = createAsyncThunk(
  "events/fetchUserEvents",
  async (userId) => {
    return await apiFetch(`/api/events/user/${userId}`);
  }
);

// 🔹 Register interest
export const registerEvent = createAsyncThunk(
  "events/registerEvent",
  async (eventId, { getState }) => {
    await apiFetch(`/api/events/${eventId}/register`, { method: "POST" });
    return { eventId, userId: getState().user.current?.id };
  }
);

// 🔹 Unregister interest
export const unregisterEvent = createAsyncThunk(
  "events/unregisterEvent",
  async (eventId, { getState }) => {
    await apiFetch(`/api/events/${eventId}/unregister`, { method: "DELETE" });
    return { eventId, userId: getState().user.current?.id };
  }
);

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    list: [], // all events
    userEvents: [], // events current user is registered for
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all events
      .addCase(fetchEvents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Fetch user events
      .addCase(fetchUserEvents.fulfilled, (state, action) => {
        state.userEvents = action.payload;
      })

      // Register interest
      .addCase(registerEvent.fulfilled, (state, action) => {
        const { eventId } = action.payload;
        // mark in main list
        const ev = state.list.find((e) => e.id === eventId);
        if (ev) ev.is_registered = true;
        // add to userEvents if not already there
        if (!state.userEvents.find((e) => e.id === eventId) && ev) {
          state.userEvents.push(ev);
        }
      })

      // Unregister interest
      .addCase(unregisterEvent.fulfilled, (state, action) => {
        const { eventId } = action.payload;
        // mark in main list
        const ev = state.list.find((e) => e.id === eventId);
        if (ev) ev.is_registered = false;
        // remove from userEvents
        state.userEvents = state.userEvents.filter((e) => e.id !== eventId);
      });
  },
});

export const selectEvents = (state) => state.events.list;
export const selectUserEvents = (state) => state.events.userEvents;
export const selectEventsStatus = (state) => state.events.status;
export const selectEventsError = (state) => state.events.error;

export default eventsSlice.reducer;
