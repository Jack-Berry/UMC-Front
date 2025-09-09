import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserById } from "../api/auth";
import AssessmentReminder from "../components/AssessmentReminder";
import ProfileStats from "../components/ProfileStats";
import Awards from "../components/Awards";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    async function refreshUser() {
      try {
        const latest = await fetchUserById(user.id);
        setUser(latest);
        localStorage.setItem("user", JSON.stringify(latest));
      } catch (err) {
        console.error("Failed to refresh user", err);
      }
    }

    refreshUser();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/home");
      return;
    }
    const user = JSON.parse(storedUser);
    if (!user.has_completed_assessment) {
      console.log(
        "Redirecting to assessment...",
        user,
        user.has_completed_assessment
      );
      navigate("/assessment");
    }
  }, [navigate]);

  return (
    <div className="text-white p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
      <AssessmentReminder />
      <ProfileStats score={user.overall_score} />
      <Awards />
    </div>
  );
}
