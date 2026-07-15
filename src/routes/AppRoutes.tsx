import { Routes, Route } from "react-router";
import { lazy } from "react";
import ProtectedRoute from "./ProtectedRoute";

// Layout
const AppLayout = lazy(() => import("@/layout/AppLayout"));

// Pages (Lazy Loaded)
const Home = lazy(() => import("@/pages/Dashboard/Home"));
const Orders = lazy(() => import("@/pages/Orders/Orders"));
const Reservations = lazy(() => import("@/pages/Reservations/Reservations"));
const UserProfiles = lazy(() => import("@/pages/UserProfiles"));

const SignIn = lazy(() => import("@/pages/AuthPages/SignIn"));
const SignUp = lazy(() => import("@/pages/AuthPages/SignUp"));

const NotFound = lazy(() => import("@/pages/OtherPage/NotFound"));

import { ROUTES } from "./routePaths";
import Users from "@/pages/Admin/user-managment/Users";
import RoleManagement from "@/pages/Admin/role-management/RoleManagement";
import PermissionsManagement from "@/pages/Admin/permissions-management/PermissionsMangement";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.PROFILE} element={<UserProfiles />} />
          <Route path={ROUTES.ORDERS} element={<Orders />} />
          <Route path={ROUTES.RESERVATIONS} element={<Reservations />} />

          {/* Admin Panel */}

          <Route path={ROUTES.USER_MANAGEMENT} element={<Users />} />
          <Route path={ROUTES.ROLE_MANAGEMENT} element={<RoleManagement />} />
          <Route
            path={ROUTES.PERMISSIONS}
            element={<PermissionsManagement />}
          />
          <Route path={ROUTES.TENANT_PLANS} element={<Users />} />
          <Route path={ROUTES.TENANTS} element={<Users />} />
        </Route>
      </Route>

      {/* Public Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
      {/* TODO: Replace with unauthorised component */}
      <Route path="/unauthorized" element={<NotFound />} />
    </Routes>
  );
}
