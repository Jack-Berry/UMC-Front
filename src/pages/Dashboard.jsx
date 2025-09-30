// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById } from "../api/auth";
import {
  selectAssessmentStatus,
  getAssessment,
} from "../redux/assessmentSlice";
import {
  selectUserEvents,
  fetchEvents,
  fetchUserEvents,
} from "../redux/eventsSlice";
import { setUser, setProfileCompletion } from "../redux/userSlice";
import UserResults from "../components/UserResults";
import ProfileStats from "../components/ProfileStats";
import Awards from "../components/Awards";
import ProfileCard from "../components/ProfileCard";
import SidebarEvents from "../components/SidebarEvents.jsx";
import SidebarFriends from "../components/SidebarFriends.jsx";
import SidebarMatches from "../components/SidebarMatches.jsx";
import LoadingSpinner from "../components/LoadingSpinner";
import { calculateProfileCompletion } from "../utils/profileCompletion";
import { Menu } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.current);
  const assessmentStatus = useSelector(selectAssessmentStatus);

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function refreshUser() {
      if (!user?.id) return;
      try {
        const latest = await fetchUserById(user.id);
        dispatch(setUser(latest));

        const types = [
          "initial",
          "diy",
          "technology",
          "self-care",
          "communication",
          "community",
        ];
        types.forEach((type) =>
          dispatch(getAssessment({ assessmentType: type, userId: latest.id }))
        );

        // 🔹 Fetch events with coords if available
        if (latest.lat && latest.lng) {
          dispatch(fetchEvents({ lat: latest.lat, lng: latest.lng }));
        } else {
          dispatch(fetchEvents());
        }

        dispatch(fetchUserEvents(user.id));
      } catch (err) {
        console.error("Failed to refresh user", err);
      } finally {
        setLoading(false);
      }
    }
    refreshUser();
  }, [user?.id, dispatch]);

  useEffect(() => {
    if (user) {
      const completion = calculateProfileCompletion(user, assessmentStatus);
      dispatch(setProfileCompletion(completion));
    }
  }, [user, assessmentStatus, dispatch]);

  useEffect(() => {
    if (!loading && user && !user.has_completed_assessment) {
      navigate("/assessment/initial");
    }
  }, [loading, user, navigate]);

  if (loading || !user) return <LoadingSpinner text="Loading dashboard..." />;

  return (
    <div className="text-white p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1 space-y-6">
          <div className="bg-gray-900/80 rounded-2xl shadow-lg p-6">
            <UserResults />
          </div>

          <div className="bg-gray-900/80 rounded-2xl shadow-lg p-6">
            <ProfileStats />
          </div>
        </div>

        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex lg:flex-col lg:w-80 lg:shrink-0">
          <div className="sticky top-6 h-[calc(100vh-3rem)] overflow-y-auto space-y-4 pr-2">
            <ProfileCard compact />
            <SidebarEvents />
            <SidebarFriends />
            <SidebarMatches />
          </div>
        </aside>

        {/* Sidebar - Mobile */}
        <div className="lg:hidden">
          {/* Slide-out panel */}
          <div
            className={`fixed top-0 right-0 h-full w-72 bg-gray-900/95 shadow-xl transform transition-transform duration-300 z-40 ${
              sidebarOpen ? "translate-x-0" : "translate-x-[99%]"
            }`}
          >
            {/* Pull handle */}
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 bg-brand-600 hover:bg-brand-500 text-white p-2 rounded-l-md shadow-md"
            >
              {sidebarOpen ? "→" : "←"}
            </button>

            {/* Sidebar content */}
            <div className="p-4 space-y-4 overflow-y-auto h-full">
              <ProfileCard compact />
              <SidebarEvents />
              <SidebarFriends />
              <SidebarMatches />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
