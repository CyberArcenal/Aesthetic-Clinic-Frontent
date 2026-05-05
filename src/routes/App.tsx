// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages (placeholder components – you will implement these)

// Admin / Staff pages

// Client pages

// Public / landing page (optional)
import PageNotFound from "../components/Shared/PageNotFound";
import PublicLayout from "../layout/PublicLayout";
import RequireAuth from "../layout/RequireAuth";
import AdminLayout from "../layout/AdminLayout";
import ClientLayout from "../layout/ClientLayout";
import HomePage from "../pages/home";
import LoginPage from "../pages/auth/login";
import RegisterPage from "../pages/auth/register";
import ForgotPasswordPage from "../pages/auth/forgot-password";
import ResetPasswordPage from "../pages/auth/reset-password";
import DashboardPage from "../pages/dashboard";
import ClientsPage from "../pages/clients/main";
import TreatmentsPage from "../pages/treatments";
import AppointmentsPage from "../pages/appointments";
import InvoicesPage from "../pages/invoices";
import PaymentsPage from "../pages/payments";
import PhotosPage from "../pages/photos";
import StaffPage from "../pages/staff";
import ReportsPage from "../pages/reports";
import AuditPage from "../pages/audit";
import SettingsPage from "../pages/settings";
import ClientDashboardPage from "../pages/clients/dashboard";
import ClientAppointmentsPage from "../pages/clients/appointment";
import ClientInvoicesPage from "../pages/clients/invoices";
import ClientPhotosPage from "../pages/clients/photos";
import ClientProfilePage from "../pages/clients/profile";
import ClientSettingsPage from "../pages/clients/settings";
import ClientNotificationsPage from "../pages/clients/notification";
import AppointmentCalendarPage from "../pages/appointment-calendar";
import AppointmentHistoryPage from "../pages/appointment-history";
import PackagesPage from "@/pages/packages";
import CategoriesPage from "@/pages/categories";
import ProfilePage from "@/pages/profile";
import UsersPage from "@/pages/users";
import InAppNotificationsPage from "@/pages/notification/inapp";
import NotifyLogsPage from "@/pages/notification/logs";
import TemplatesPage from "@/pages/notification/templates";

function App() {
  return (
    <Routes>
      {/* Public routes – no authentication */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      {/* Admin / Staff routes (full management) */}
      <Route element={<RequireAuth allowedRoles={["Admin", "Staff"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientsPage />} />

          <Route path="/treatments" element={<TreatmentsPage />} />
          <Route path="/treatments/packages" element={<PackagesPage />} />
          <Route path="/treatments/categories" element={<CategoriesPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/appointments/calendar" element={<AppointmentCalendarPage />} />
          <Route path="/notifications/inapp" element={<InAppNotificationsPage />} />
          <Route path="/notifications/logs" element={<NotifyLogsPage />} />
          <Route path="/notifications/templates" element={<TemplatesPage />} />
          
          <Route path="/appointments/history" element={<AppointmentHistoryPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/photos" element={<PhotosPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/audit" element={<AuditPage />} />

          <Route path="/users" element={<UsersPage />} />
          {/* fallback */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Route>

      {/* Client routes (limited access) */}
      <Route element={<RequireAuth allowedRoles={["Client"]} />}>
        <Route element={<ClientLayout />}>
          <Route path="/client/dashboard" element={<ClientDashboardPage />} />
          <Route
            path="/client/appointments"
            element={<ClientAppointmentsPage />}
          />
          <Route path="/client/invoices" element={<ClientInvoicesPage />} />
          <Route path="/client/photos" element={<ClientPhotosPage />} />
          <Route
            path="/client/notifications"
            element={<ClientNotificationsPage />}
          />
          <Route path="/client/profile" element={<ClientProfilePage />} />
          <Route path="/client/settings" element={<ClientSettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
