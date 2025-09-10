import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserById } from "../api/auth";
import AssessmentReminder from "../components/AssessmentReminder";
import ProfileStats from "../components/ProfileStats";
import Awards from "../components/Awards";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function refreshUser() {
      try {
        if (!user) return navigate("/home"); // no user at all
        const latest = await fetchUserById(user.id);
        setUser(latest);
        localStorage.setItem("user", JSON.stringify(latest));
      } catch (err) {
        console.error("Failed to refresh user", err);
      } finally {
        setLoading(false);
      }
    }
    refreshUser();
  }, [user?.id, navigate]);

  useEffect(() => {
    if (!loading && user && !user.has_completed_assessment) {
      console.log("Redirecting to initial assessment...");
      navigate("/assessment/initial");
    }
  }, [loading, user, navigate]);

  if (loading || !user) return <p className="text-white">Loading...</p>;

  return (
    <div className="text-white p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
      <AssessmentReminder />
      <ProfileStats score={user.overall_score} />
      <Awards />
    </div>
  );
}
