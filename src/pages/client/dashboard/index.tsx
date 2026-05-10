import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CreditCard, Camera, Bell, ChevronRight, Clock } from "lucide-react";
import { authStore } from "../../../stores/authStore";
import appointmentApi from "../../../api/core/appointment";
import billingApi from "../../../api/core/billing";
import type { AppointmentResponseDto } from "../../../api/core/appointment";
import type { InvoiceResponseDto } from "../../../api/core/billing";
import { formatDateTime, formatCurrency } from "../../../utils/formatters";

const ClientDashboard: React.FC = () => {
  const user = authStore.getUser();
  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentResponseDto[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<InvoiceResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        // Get client appointments
        const aptRes = await appointmentApi.getAppointmentsByClient(user.id);
        if (aptRes.success) {
          const future = aptRes.data.filter(a => new Date(a.appointmentDateTime) > new Date()).slice(0, 5);
          setUpcomingAppointments(future);
        }
        // Get client invoices
        const invRes = await billingApi.getInvoicesByClient(user.id);
        if (invRes.success) {
          setRecentInvoices(invRes.data.slice(0, 5));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  const stats = [
    { label: "Upcoming Appointments", value: upcomingAppointments.length, icon: CalendarDays, color: "blue", link: "/client/appointments" },
    { label: "Unpaid Invoices", value: recentInvoices.filter(i => i.status === "Pending" || i.status === "Unpaid").length, icon: CreditCard, color: "orange", link: "/client/invoices" },
    { label: "Treatment Photos", value: "View", icon: Camera, color: "green", link: "/client/photos" },
    { label: "Notifications", value: "Check", icon: Bell, color: "purple", link: "/client/notifications" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {user?.fullName || user?.username}!</h1>
        <p className="text-gray-500">Manage your appointments, invoices, and more.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Link key={idx} to={stat.link} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
            <div className={`w-10 h-10 rounded-full bg-${stat.color}-100 flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
            </div>
            <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
          <Link to="/client/appointments" className="text-sm text-[var(--primary-color)] hover:underline flex items-center gap-1">View all <ChevronRight size={16} /></Link>
        </div>
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No upcoming appointments. <Link to="/appointments/book" className="text-[var(--primary-color)]">Book one now</Link></div>
          ) : (
            upcomingAppointments.map(apt => (
              <div key={apt.id} className="p-4 flex flex-wrap justify-between items-center gap-3">
                <div>
                  <p className="font-medium text-gray-800">{apt.treatmentName || `Treatment #${apt.treatmentId}`}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><Clock size={14} /> {formatDateTime(apt.appointmentDateTime)}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {apt.status || 'Scheduled'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Recent Invoices</h2>
          <Link to="/client/invoices" className="text-sm text-[var(--primary-color)] hover:underline flex items-center gap-1">View all <ChevronRight size={16} /></Link>
        </div>
        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : recentInvoices.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No invoices found.</div>
          ) : (
            recentInvoices.map(inv => (
              <div key={inv.id} className="p-4 flex flex-wrap justify-between items-center gap-3">
                <div>
                  <p className="font-medium text-gray-800">Invoice #{inv.invoiceNumber}</p>
                  <p className="text-sm text-gray-500">Due: {new Date(inv.dueDate || inv.issueDate).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">{formatCurrency(inv.total)}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {inv.status || 'Pending'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;