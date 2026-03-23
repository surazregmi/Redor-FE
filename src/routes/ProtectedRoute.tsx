import { Navigate, Outlet } from "react-router";
// import { useAuth } from "@/context/AuthContext";

type ProtectedRouteProps = {
  allowedRoles?: string[];
};

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  //   const { user, isAuthenticated, loading } = useAuth(); // TODO: Use auth hook later

  //TODO: replace later
  const user = { name: "suraj", role: "admin", email: "suraj@test.com" };

  const loading = false;

  const isAuthenticated = true;

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // Role-based check (optional)
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
