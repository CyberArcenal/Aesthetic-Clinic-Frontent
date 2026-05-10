import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, XCircle, CheckCircle } from "lucide-react";
import { authStore } from "../../../stores/authStore";
import appointmentApi from "../../../api/core/appointment";
import type { AppointmentResponseDto } from "../../../api/core/appointment";
import { formatDateTime } from "../../../utils/formatters";
import { dialogs } from "../../../utils/dialogs";
import { showToast } from "../../../utils/notification";

const ClientAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const user = authStore.getUser();

  const fetchAppointments = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await appointmentApi.getAppointmentsByClient(user.id);
      if (res.success) {
        setAppointments(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user?.id]);

  const handleCancel = async (id: number) => {
    const confirmed = await dialogs.confirm({ title: "Cancel Appointment", message: "Are you sure you want to cancel this appointment?" });
    if (!confirmed) return;
    try {
      await appointmentApi.updateAppointmentStatus(id, { status: "Cancelled" });
      showToast("Appointment cancelled", "success");
      fetchAppointments();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const upcoming = appointments.filter(a => a.status !== "Cancelled" && a.status !== "Completed" && new Date(a.appointmentDateTime) > new Date());
  const past = appointments.filter(a => a.status === "Completed" || a.status === "Cancelled" || new Date(a.appointmentDateTime) <= new Date());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
        <p className="text-gray-500">View and manage your scheduled treatments.</p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading appointments...</div>
      ) : (
        <>
          {/* Upcoming Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2"><Calendar size={18} /> Upcoming</h2>
            {upcoming.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center text-gray-500">No upcoming appointments.</div>
            ) : (
              <div className="grid gap-4">
                {upcoming.map(apt => (
                  <div key={apt.id} className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap justify-between items-center gap-3">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-800">{apt.treatmentName || `Treatment #${apt.treatmentId}`}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1"><Clock size={14} /> {formatDateTime(apt.appointmentDateTime)}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin size={14} /> {apt.assignedStaff || "Staff to be assigned"}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">{apt.status || "Scheduled"}</span>
                      <button onClick={() => handleCancel(apt.id)} className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"><XCircle size={16} /> Cancel</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2"><CheckCircle size={18} /> Past</h2>
            {past.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center text-gray-500">No past appointments.</div>
            ) : (
              <div className="grid gap-4">
                {past.map(apt => (
                  <div key={apt.id} className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap justify-between items-center gap-3 opacity-80">
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-800">{apt.treatmentName || `Treatment #${apt.treatmentId}`}</p>
                      <p className="text-sm text-gray-500">{formatDateTime(apt.appointmentDateTime)}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${apt.status === "Completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {apt.status || "Cancelled"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ClientAppointments;