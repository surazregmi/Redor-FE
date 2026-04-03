import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/store/authStore";

type ProtectedRouteProps = {
  allowedRoles?: string[];
};

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }

  if (
    allowedRoles &&
    user &&
    !allowedRoles.some((role) => user.roles.includes(role))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
