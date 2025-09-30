// src/redux/middleware/localStorageSync.js
import { setUser, clearUser, setProfileCompletion } from "../userSlice";

export const localStorageSync = (store) => (next) => (action) => {
  const result = next(action);

  // Always take from current Redux state instead of raw payload
  if (action.type === setUser.type) {
    const state = store.getState();
    const user = state.user.current;
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  if (action.type === setProfileCompletion.type) {
    const state = store.getState();
    const user = state.user.current;
    if (user) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          profileCompletion: state.user.profileCompletion,
        })
      );
    }
  }

  if (action.type === clearUser.type) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  return result;
};
