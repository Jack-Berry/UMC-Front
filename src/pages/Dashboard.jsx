// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById } from "../api/auth";
import {
  selectAssessmentStatus,
  getAssessment,
} from "../redux/assessmentSlice";
import { setUser, setProfileCompletion } from "../redux/userSlice";
import AssessmentReminder from "../components/AssessmentReminder";
import ProfileStats from "../components/ProfileStats";
import Awards from "../components/Awards";
import ProfileCard from "../components/ProfileCard";
import FriendsList from "../components/FriendsList";
import MatchesList from "../components/MatchesList";
import { calculateProfileCompletion } from "../utils/profileCompletion";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.current);
  const assessmentStatus = useSelector(selectAssessmentStatus);

  const [loading, setLoading] = useState(true);

  // 🔹 Fetch latest user + assessments when we have a user.id
  useEffect(() => {
    async function refreshUser() {
      if (!user?.id) return;
      try {
        const latest = await fetchUserById(user.id);
        dispatch(setUser(latest)); // ✅ middleware syncs it
        dispatch(
          getAssessment({ assessmentType: "initial", userId: latest.id })
        );
        console.log("✅ Dispatched getAssessment for initial");
      } catch (err) {
        console.error("Failed to refresh user", err);
      } finally {
        setLoading(false);
        console.log("✅ Finished loading user data");
      }
    }
    refreshUser();
  }, [user?.id, dispatch]);

  // 🔹 Update profileCompletion in Redux
  useEffect(() => {
    if (user) {
      const completion = calculateProfileCompletion(user, assessmentStatus);
      dispatch(setProfileCompletion(completion));
      console.log("🔄 Recalculated profileCompletion:", completion);
    }
  }, [user, assessmentStatus, dispatch]);

  // 🔹 Redirect if user hasn’t done assessment
  useEffect(() => {
    if (!loading && user && !user.has_completed_assessment) {
      console.log("Assessment redirect triggered");
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
      <FriendsList />
      <MatchesList />
    </div>
  );
}
