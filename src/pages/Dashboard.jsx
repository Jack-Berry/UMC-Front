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
import AssessmentReminder from "../components/AssessmentReminder";
import ProfileStats from "../components/ProfileStats";
import UserResults from "../components/UserResults";
import Awards from "../components/Awards";
import ProfileCard from "../components/ProfileCard";
import FriendsList from "../components/FriendsList";
import MatchesList from "../components/MatchesList";
import UserEvents from "../components/UserEvents";
import { calculateProfileCompletion } from "../utils/profileCompletion";
import LoadingSpinner from "../components/LoadingSpinner";
import SidebarEvents from "../components/SidebarEvents.jsx";
import SidebarFriends from "../components/SidebarFriends.jsx";
import SidebarMatches from "../components/SidebarMatches.jsx";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.current);
  const assessmentStatus = useSelector(selectAssessmentStatus);
  const userEvents = useSelector(selectUserEvents);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function refreshUser() {
      if (!user?.id) return;
      try {
        const latest = await fetchUserById(user.id);
        dispatch(setUser(latest));

        // fetch all assessment types
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

        // fetch events
        dispatch(fetchEvents());
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
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content */}
        <div className="flex-1 space-y-6">
          <div className="bg-gray-900/80 rounded-2xl shadow-lg p-6">
            <UserResults />
          </div>

          <div className="bg-gray-900/80 rounded-2xl shadow-lg p-6">
            <ProfileStats />
          </div>

          <div className="bg-gray-900/80 rounded-2xl shadow-lg p-6">
            <Awards />
          </div>

          {/* Mobile: collapsible panels */}
          <div className="space-y-4 lg:hidden">
            <details className="bg-gray-900/80 rounded-2xl shadow-lg p-4">
              <summary className="cursor-pointer font-semibold">
                Your Events
              </summary>
              <UserEvents events={userEvents} />
            </details>

            <details className="bg-gray-900/80 rounded-2xl shadow-lg p-4">
              <summary className="cursor-pointer font-semibold">
                Friends
              </summary>
              <FriendsList />
            </details>

            <details className="bg-gray-900/80 rounded-2xl shadow-lg p-4">
              <summary className="cursor-pointer font-semibold">
                Matches
              </summary>
              <MatchesList />
            </details>
          </div>
        </div>

        {/* Desktop: sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-80 lg:shrink-0">
          <div className="sticky top-6 h-[calc(100vh-3rem)] overflow-y-auto space-y-4 pr-2">
            <ProfileCard compact />
            <SidebarEvents />
            <SidebarFriends />
            <SidebarMatches />
          </div>
        </aside>
      </div>
    </div>
  );
}
