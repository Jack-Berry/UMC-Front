// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import assessmentReducer from "./assessmentSlice";
import eventsReducer from "./eventsSlice";
import newsReducer from "./newsSlice";
import friendsReducer from "./friendsSlice";
import messagesReducer from "./messagesSlice";
import { localStorageSync } from "./middleware/localStorageSync";

export const store = configureStore({
  reducer: {
    user: userReducer,
    assessments: assessmentReducer,
    events: eventsReducer,
    news: newsReducer,
    friends: friendsReducer,
    messages: messagesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(localStorageSync),
});
