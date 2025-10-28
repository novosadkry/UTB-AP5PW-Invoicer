import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";

export default function ProtectedRoute({ children }: React.PropsWithChildren) {
  const { accessToken } = useAuth();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
