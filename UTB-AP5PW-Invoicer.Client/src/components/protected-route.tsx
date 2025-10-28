import React from "react";
import { Navigate } from "react-router";

export default function ProtectedRoute({ children }: React.PropsWithChildren) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
