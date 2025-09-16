import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AdminGuard({ children }) {
  const user = useSelector((state) => state.user.current);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.is_admin) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
