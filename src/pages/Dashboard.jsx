import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/home");
      return;
    }
    const user = JSON.parse(storedUser);
    if (!user.hasCompletedAssessment) {
      console.log("Redirecting to assessment...", user.hasCompletedAssessment);
      navigate("/assessment");
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <h1>Welcome back!</h1>
      <p>Your dashboard content goes here.</p>
    </div>
  );
}
