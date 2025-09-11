import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const user = useSelector((s) => s.user.current);
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken && !user) {
    return <p className="text-white">Loading...</p>; // optional loading
  }

  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
