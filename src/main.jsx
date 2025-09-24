// src/main.jsx
import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { setUser, clearUser } from "./redux/userSlice";

// Pages & components
import SplashGate from "./pages/SplashGate.jsx";
import App from "./App.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AssessmentFlow from "./pages/AssessmentFlow.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminGuard from "./components/AdminGuard.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminAssessments from "./pages/admin/AdminAssessments.jsx";
import EditAssessment from "./pages/admin/EditAssessment.jsx";
import AdminEvents from "./pages/admin/AdminEvents.jsx";
import AdminNews from "./pages/admin/AdminNews.jsx";
import Messages from "./pages/Messages.jsx";
import Home from "./pages/Home.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy.jsx";
import TermsOfUse from "./components/TermsOfUse.jsx";
import SafeguardingPolicy from "./components/SafeguardingPolicy.jsx";
import FriendsList from "./components/FriendsList.jsx";
import MatchesList from "./components/MatchesList.jsx";
import UserEvents from "./components/UserEvents.jsx";

/* 🔑 Attach API key directly to gmpx-loader */
const loaderEl = document.getElementById("gmpx-loader");
if (loaderEl) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY;
  if (apiKey) loaderEl.setAttribute("key", apiKey);
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
        <Route
          path="messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="events"
          element={
            <ProtectedRoute>
              <>
                <UserEvents />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="friends"
          element={
            <ProtectedRoute>
              <FriendsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="matches"
          element={
            <ProtectedRoute>
              <MatchesList />
            </ProtectedRoute>
          }
        />

        {/* 🔹 Admin routes */}
        <Route
          path="admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<AdminAssessments />} />
          <Route path="assessments/:type" element={<EditAssessment />} />
          <Route
            path="assessments/:type/:parentId"
            element={<EditAssessment />}
          />
          <Route path="events" element={<AdminEvents />} />
          <Route path="news" element={<AdminNews />} /> {/* ✅ Added */}
        </Route>

        {/* 🔹 Public policy/legal routes */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/safeguarding-policy" element={<SafeguardingPolicy />} />
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

  if (event.key === "accessToken" && !event.newValue) {
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
