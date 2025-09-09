import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

//src/pages/Home.jsx
export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      navigate("/dashboard");
    }
  }, [navigate]);
  return (
    <div className="flex items-center justify-center min-h-screen text-white">
      <h1>Welcome!</h1>
      <p>This is the private preview area.</p>
    </div>
  );
}
