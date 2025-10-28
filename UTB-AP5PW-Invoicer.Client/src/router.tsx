import { BrowserRouter, Route, Routes } from "react-router";
import Index from "@pages/index/page";
import Login from "@pages/auth/login/page";
import Signup from "@pages/auth/signup/page";
import Dashboard from "@pages/dashboard/page";
import ProtectedRoute from "@components/protected-route";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}
