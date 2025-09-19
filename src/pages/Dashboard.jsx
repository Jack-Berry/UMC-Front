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
import Awards from "../components/Awards";
import ProfileCard from "../components/ProfileCard";
import FriendsList from "../components/FriendsList";
import MatchesList from "../components/MatchesList";
import UserEvents from "../components/UserEvents";
import { calculateProfileCompletion } from "../utils/profileCompletion";

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

  if (loading || !user) return <p className="text-white">Loading...</p>;

  return (
    <div className="text-white p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
      <AssessmentReminder />
      <ProfileCard />
      <ProfileStats />
      <Awards />
      <UserEvents events={userEvents} />
      <FriendsList />
      <MatchesList />
    </div>
  );
}
