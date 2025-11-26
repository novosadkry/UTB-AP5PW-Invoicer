import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/hooks/use-auth";

export default function ProtectedRoute({ children }: React.PropsWithChildren) {
  const { accessToken } = useAuth();
  const { pathname, search } = useLocation();
  const redirect = encodeURIComponent(pathname + search);

  if (!accessToken) {
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return children;
}
