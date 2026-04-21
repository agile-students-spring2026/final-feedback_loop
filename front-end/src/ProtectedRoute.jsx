import { Navigate } from "react-router-dom";
import { getToken } from "./api";

const ProtectedRoute = ({ children }) => {
  const token = getToken();
  if (!token) return <Navigate to="/signin" replace />;
  return children;
};

export const PublicOnlyRoute = ({ children }) => {
  const token = getToken();
  if (token) return <Navigate to="/explore" replace />;
  return children;
};

export default ProtectedRoute;
