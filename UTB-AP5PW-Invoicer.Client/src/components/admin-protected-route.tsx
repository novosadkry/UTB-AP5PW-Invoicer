import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/hooks/use-auth";

export default function AdminProtectedRoute({ children }: React.PropsWithChildren) {
  const { accessToken, user } = useAuth();
  const { pathname, search } = useLocation();
  const redirect = encodeURIComponent(pathname + search);

  if (!accessToken) {
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
