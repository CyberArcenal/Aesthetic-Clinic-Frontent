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
import HomePage from "../pages/public/landing";
import DashboardPage from "../pages/admin/dashboard";
import TreatmentsPage from "../pages/admin/treatments";
import AppointmentsPage from "../pages/admin/appointments";
import InvoicesPage from "../pages/admin/invoices";
import PaymentsPage from "../pages/admin/payments";
import PhotosPage from "../pages/admin/photos";
import StaffPage from "../pages/admin/staff";
import ReportsPage from "../pages/admin/reports";
import AuditPage from "../pages/admin/audit";
import SettingsPage from "../pages/admin/settings";
import AppointmentCalendarPage from "../pages/admin/appointment-calendar";
import AppointmentHistoryPage from "../pages/admin/appointment-history";
import PackagesPage from "@/pages/admin/packages";
import CategoriesPage from "@/pages/admin/categories";
import ProfilePage from "@/pages/admin/profile";
import UsersPage from "@/pages/admin/users";
import InAppNotificationsPage from "@/pages/admin/notification/inapp";
import NotifyLogsPage from "@/pages/admin/notification/logs";
import TemplatesPage from "@/pages/admin/notification/templates";
import PublicTreatmentsPage from "@/pages/public/treatments";
import PublicTreatmentDetailPage from "@/pages/public/treatments/details";
import ContactPage from "@/pages/public/contact";
import ClientDashboard from "@/pages/client/dashboard";
import ClientAppointments from "@/pages/client/appointments";
import ClientInvoices from "@/pages/client/invoices";
import ClientPhotos from "@/pages/client/photos";
import ClientNotifications from "@/pages/client/notifications";
import ClientSettings from "@/pages/client/settings";
import ClientProfile from "@/pages/client/profile";
import ClientsPage from "@/pages/client/main";
import LoginPage from "@/pages/public/auth/login";
import RegisterPage from "@/pages/public/auth/register";
import ForgotPasswordPage from "@/pages/public/auth/forgot-password";
import ResetPasswordPage from "@/pages/public/auth/reset-password";

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
        <Route path="/treatments" element={<PublicTreatmentsPage />} />
        <Route path="/treatments/:id" element={<PublicTreatmentDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* Admin / Staff routes (full management) */}
      <Route element={<RequireAuth allowedRoles={["Admin", "Staff"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/clients" element={<ClientsPage />} />

          <Route path="/admin/treatments" element={<TreatmentsPage />} />
          <Route path="/admin/treatments/packages" element={<PackagesPage />} />
          <Route
            path="/admin/treatments/categories"
            element={<CategoriesPage />}
          />
          <Route path="/admin/appointments" element={<AppointmentsPage />} />
          <Route
            path="/admin/appointments/calendar"
            element={<AppointmentCalendarPage />}
          />
          <Route
            path="/admin/notifications/inapp"
            element={<InAppNotificationsPage />}
          />
          <Route
            path="/admin/notifications/logs"
            element={<NotifyLogsPage />}
          />
          <Route
            path="/admin/notifications/templates"
            element={<TemplatesPage />}
          />

          <Route
            path="/admin/appointments/history"
            element={<AppointmentHistoryPage />}
          />
          <Route path="/admin/invoices" element={<InvoicesPage />} />
          <Route path="/admin/payments" element={<PaymentsPage />} />
          <Route path="/admin/photos" element={<PhotosPage />} />
          <Route path="/admin/staff" element={<StaffPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
          <Route path="/admin/audit" element={<AuditPage />} />

          <Route path="/admin/users" element={<UsersPage />} />
          {/* fallback */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Route>

      {/* Client routes (limited access) */}
      <Route element={<RequireAuth allowedRoles={["Client"]} />}>
        <Route element={<ClientLayout />}>
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/appointments" element={<ClientAppointments />} />
          <Route path="/client/invoices" element={<ClientInvoices />} />
          <Route path="/client/photos" element={<ClientPhotos />} />
          <Route
            path="/client/notifications"
            element={<ClientNotifications />}
          />
          <Route path="/client/profile" element={<ClientProfile />} />
          <Route path="/client/settings" element={<ClientSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
