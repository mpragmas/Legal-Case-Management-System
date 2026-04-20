import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
