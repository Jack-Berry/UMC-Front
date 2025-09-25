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
      // Store everything we get from backend, including new fields
      state.current = {
        ...action.payload,
        category_scores: action.payload.category_scores || null,
        tag_scores: action.payload.tag_scores || null,
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
