import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DayAppointmentsModal from "./components/DayAppointmentsModal";
import type { AppointmentResponseDto } from "../../../api/core/appointment";
import { hideLoading, showLoading, showToast } from "../../../utils/notification";
import appointmentApi from "../../../api/core/appointment";

const localizer = momentLocalizer(moment);

const AppointmentCalendarPage: React.FC = () => {
  const [appointments, setAppointments] = useState<AppointmentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDateAppointments, setSelectedDateAppointments] = useState<AppointmentResponseDto[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    showLoading("Loading appointments...");
    try {
      const res = await appointmentApi.getAppointments({ page: 1, pageSize: 1000 });
      if (res.success) {
        setAppointments(res.data.items);
      } else {
        showToast(res.message || "Failed to fetch appointments", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Network error", "error");
    } finally {
      setLoading(false);
      hideLoading();
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const events = useMemo(() => {
    return appointments.map((apt) => ({
      id: apt.id,
      title: `${apt.clientName || `Client ${apt.clientId}`}`,
      start: new Date(apt.appointmentDateTime),
      end: new Date(new Date(apt.appointmentDateTime).getTime() + (apt.durationMinutes || 60) * 60000),
      resource: apt,
    }));
  }, [appointments]);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    const clickedDate = slotInfo.start;
    const appointmentsForDay = appointments.filter((apt) => {
      const aptDate = new Date(apt.appointmentDateTime);
      return (
        aptDate.getFullYear() === clickedDate.getFullYear() &&
        aptDate.getMonth() === clickedDate.getMonth() &&
        aptDate.getDate() === clickedDate.getDate()
      );
    });
    setSelectedDate(clickedDate);
    setSelectedDateAppointments(appointmentsForDay);
    setModalOpen(true);
  };

  const handleSelectEvent = (event: any) => {
    const apt = event.resource;
    const aptDate = new Date(apt.appointmentDateTime);
    const appointmentsForDay = appointments.filter((a) => {
      const aDate = new Date(a.appointmentDateTime);
      return (
        aDate.getFullYear() === aptDate.getFullYear() &&
        aDate.getMonth() === aptDate.getMonth() &&
        aDate.getDate() === aptDate.getDate()
      );
    });
    setSelectedDate(aptDate);
    setSelectedDateAppointments(appointmentsForDay);
    setModalOpen(true);
  };

  const eventStyleGetter = (event: any) => {
    const status = event.resource.status;
    let backgroundColor = "#3b82f6"; // scheduled
    switch (status) {
      case "Confirmed":
        backgroundColor = "#10b981";
        break;
      case "Cancelled":
        backgroundColor = "#ef4444";
        break;
      case "Completed":
        backgroundColor = "#6366f1";
        break;
      case "NoShow":
        backgroundColor = "#f59e0b";
        break;
    }
    return { style: { backgroundColor, borderRadius: "4px", color: "white", border: "none" } };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--primary-color)]"></div>
      </div>
    );
  }

  return (
    <div className="compact-card rounded-md shadow-md border p-4" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold" style={{ color: "var(--sidebar-text)" }}>Appointment Calendar</h2>
        <p className="text-sm text-[var(--text-secondary)]">View all appointments in month, week, or day view</p>
      </div>
      <div style={{ height: "calc(100vh - 200px)", minHeight: 500 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          eventPropGetter={eventStyleGetter}
          defaultView={Views.MONTH}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          step={30}
          timeslots={2}
          popup
        />
      </div>
      <DayAppointmentsModal
        isOpen={modalOpen}
        date={selectedDate}
        appointments={selectedDateAppointments}
        onClose={() => setModalOpen(false)}
        onViewAppointment={(id) => {
          // For now, just close modal; later you can open a full appointment view dialog
          setModalOpen(false);
          // Optionally open the view dialog from useAppointmentView (or just a placeholder toast)
          showToast(`View appointment #${id} (placeholder)`, "info");
        }}
      />
    </div>
  );
};

export default AppointmentCalendarPage;