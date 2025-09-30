// src/redux/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Load from localStorage if available
const stored = localStorage.getItem("user");
const initialUser = stored ? JSON.parse(stored) : null;

const userSlice = createSlice({
  name: "user",
  initialState: {
    current: initialUser,
    profileCompletion: 0,
  },
  reducers: {
    setUser: (state, action) => {
      const u = action.payload || {};

      // Normalise new schema fields
      state.current = {
        id: u.id,
        first_name: u.first_name || "",
        last_name: u.last_name || "",
        display_name: u.display_name || u.first_name || "",
        email: u.email || "",
        dob: u.dob || null,
        consent_terms: !!u.consent_terms,

        // existing fields we already use
        avatar_url: u.avatar_url || null,
        has_completed_assessment: u.has_completed_assessment || false,
        is_admin: u.is_admin || false,
        profile_completion: u.profile_completion || 0,
        useful_at: u.useful_at || null,
        useless_at: u.useless_at || null,
        location: u.location || null,
        show_location: u.show_location ?? true,
        lat: u.lat || null,
        lng: u.lng || null,
        region: u.region || null,
        category_scores: u.category_scores || null,
        tag_scores: u.tag_scores || null,
        created_at: u.created_at || null,
      };

      localStorage.setItem("user", JSON.stringify(state.current));
    },
    clearUser: (state) => {
      state.current = null;
      localStorage.removeItem("user");
    },
    setProfileCompletion: (state, action) => {
      state.profileCompletion = action.payload;
    },
    updateUserScores: (state, action) => {
      if (state.current) {
        state.current.category_scores = action.payload.category_scores;
        state.current.tag_scores = action.payload.tag_scores;
        localStorage.setItem("user", JSON.stringify(state.current));
      }
    },
  },
});

export const { setUser, clearUser, setProfileCompletion, updateUserScores } =
  userSlice.actions;

export default userSlice.reducer;
