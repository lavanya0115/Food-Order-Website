import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components/common/States";
export function Protected({ roles, children }) {
  const { user, role, loading } = useAuth(),
    loc = useLocation();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  if (roles && !roles.includes(role))
    return <Navigate to="/unauthorised" replace />;
  return children;
}
export function RoleHome() {
  const { role } = useAuth();
  return (
    <Navigate
      to={
        role === "super_admin"
          ? "/super-admin"
          : role === "admin"
            ? "/admin"
            : "/my-orders"
      }
      replace
    />
  );
}
