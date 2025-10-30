import { BrowserRouter, Route, Routes } from "react-router";
import Index from "@pages/index/page";
import Login from "@pages/auth/login/page";
import Signup from "@pages/auth/signup/page";
import Dashboard from "@pages/dashboard/page";
import Invoices from "@pages/dashboard/invoices/page";
import ProtectedRoute from "@components/protected-route";
import NotFound from "@pages/errors/404";

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
        <Route path="/dashboard/invoices" element={
          <ProtectedRoute>
            <Invoices />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
