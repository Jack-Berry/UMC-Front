import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { setUser, clearUser } from "./redux/userSlice"; // ✅ add this
import SplashGate from "./pages/SplashGate.jsx";
import App from "./App.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AssessmentFlow from "./pages/AssessmentFlow.jsx";
import Home from "./pages/Home.jsx";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

function AuthenticatedApp() {
  const isAuthenticated = localStorage.getItem("authenticated") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/gate" />;
  }

  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="assessment/:type"
          element={
            <ProtectedRoute>
              <AssessmentFlow />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

// ✅ Cross-tab sync for user & token
window.addEventListener("storage", (event) => {
  if (event.key === "user") {
    if (event.newValue) {
      const user = JSON.parse(event.newValue);
      store.dispatch(setUser(user));
    } else {
      store.dispatch(clearUser());
    }
  }

  if (event.key === "token" && !event.newValue) {
    store.dispatch(clearUser());
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/gate" element={<SplashGate />} />
        <Route path="/*" element={<AuthenticatedApp />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);
