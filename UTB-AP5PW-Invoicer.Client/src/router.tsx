import { BrowserRouter, Route, Routes } from "react-router";
import Index from "@pages/index/page";
import Login from "@pages/auth/login/page";
import Signup from "@pages/auth/signup/page";
import Dashboard from "@pages/dashboard/page";
import Invoices from "@pages/dashboard/invoices/page";
import Invoice from "@pages/dashboard/invoices/[id]/page";
import Customers from "@pages/dashboard/customers/page";
import Customer from "@pages/dashboard/customers/[id]/page";
import Profile from "@pages/dashboard/profile/page";
import Reports from "@pages/dashboard/reports/page";
import Admin from "@pages/dashboard/admin/page";
import SharedInvoice from "@pages/shared/invoice/page";
import ProtectedRoute from "@components/protected-route";
import AdminProtectedRoute from "@components/admin-protected-route";
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
        <Route path="/dashboard/invoices/:id" element={
          <ProtectedRoute>
            <Invoice />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/customers" element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/customers/:id" element={
          <ProtectedRoute>
            <Customer />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/reports" element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/admin" element={
          <AdminProtectedRoute>
            <Admin />
          </AdminProtectedRoute>
        } />
        <Route path="/shared/invoice/:token" element={<SharedInvoice />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
