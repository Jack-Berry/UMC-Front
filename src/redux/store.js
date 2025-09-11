// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import assessmentReducer from "./assessmentSlice";
import { localStorageSync } from "./middleware/localStorageSync";

export const store = configureStore({
  reducer: {
    user: userReducer,
    assessments: assessmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageSync),
});
