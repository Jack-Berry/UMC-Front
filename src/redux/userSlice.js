// src/redux/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

// 🔹 Try to hydrate initial user from localStorage
const storedUser = JSON.parse(localStorage.getItem("user"));

const initialState = {
  current: storedUser || null,
  profileCompletion: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.current = action.payload;
    },
    clearUser: (state) => {
      state.current = null;
      state.profileCompletion = 0;
    },
    setProfileCompletion: (state, action) => {
      state.profileCompletion = action.payload;
    },
  },
});

export const { setUser, clearUser, setProfileCompletion } = userSlice.actions;
export default userSlice.reducer;
