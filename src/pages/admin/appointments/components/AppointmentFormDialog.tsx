// src/pages/appointments/components/AppointmentFormDialog.tsx
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import appointmentApi, {
  AppointmentResponseDto,
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from "@/api/core/appointment";
import { showToast } from "@/utils/notification";
import { dialogs } from "@/utils/dialogs";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import ClientSelect from "@/components/Selects/Client";
import TreatmentSelect from "@/components/Selects/Treatment";
import StaffSelect from "@/components/Selects/Staff";

interface AppointmentFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  appointmentId: number | null;
  initialData: Partial<AppointmentResponseDto> | null;
  onClose: () => void;
  onSuccess: () => void;
}

// Zod schema: numbers must be > 0 (positive) for required fields
const appointmentSchema = z.object({
  clientId: z.number().min(1, "Client is required"),
  treatmentId: z.number().min(1, "Treatment is required"),
  assignedStaffId: z.number().nullable().optional(), // we use staff id, not name
  appointmentDateTime: z.string().min(1, "Date and time is required"),
  notes: z.string().optional(),
  status: z.string().optional(),
});

type FormValues = z.infer<typeof appointmentSchema>;

const AppointmentFormDialog: React.FC<AppointmentFormDialogProps> = ({
  isOpen,
  mode,
  appointmentId,
  initialData,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      clientId: 0,
      treatmentId: 0,
      assignedStaffId: null,
      appointmentDateTime: "",
      notes: "",
      status: "Scheduled",
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (initialData && mode === "edit") {
      setValue("clientId", initialData.clientId || 0);
      setValue("treatmentId", initialData.treatmentId || 0);
      // If we have assignedStaff (string name), we can't map to assignedStaffId directly.
      // For simplicity, we'll just keep the staff name in a separate field or ignore.
      // Better: we store assignedStaffId in the backend; for now, we'll skip.
      const iso = initialData.appointmentDateTime;
      if (iso) {
        setValue("appointmentDateTime", iso.slice(0, 16));
      }
      setValue("notes", initialData.notes || "");
      setValue("status", initialData.status || "Scheduled");
    } else {
      reset({
        clientId: 0,
        treatmentId: 0,
        assignedStaffId: null,
        appointmentDateTime: "",
        notes: "",
        status: "Scheduled",
      });
    }
  }, [initialData, mode, reset, setValue]);

  const onSubmit = async (data: FormValues) => {
    if (mode === "add") {
      try {
        const createData: CreateAppointmentDto = {
          clientId: data.clientId,
          treatmentId: data.treatmentId,
          assignedStaff: data.assignedStaffId ? String(data.assignedStaffId) : undefined, // adjust based on API
          appointmentDateTime: new Date(data.appointmentDateTime).toISOString(),
          notes: data.notes || undefined,
        };
        await appointmentApi.createAppointment(createData);
        showToast("Appointment created successfully", "success");
        onSuccess();
        onClose();
      } catch (err: any) {
        dialogs.error(err.message || "Failed to create appointment");
      }
    } else if (mode === "edit" && appointmentId) {
      try {
        const updateData: UpdateAppointmentDto = {
          clientId: data.clientId,
          treatmentId: data.treatmentId,
          assignedStaff: data.assignedStaffId ? String(data.assignedStaffId) : undefined,
          appointmentDateTime: new Date(data.appointmentDateTime).toISOString(),
          notes: data.notes,
        };
        await appointmentApi.updateAppointment(appointmentId, updateData);
        if (data.status && data.status !== initialData?.status) {
          await appointmentApi.updateAppointmentStatus(appointmentId, {
            status: data.status,
          });
        }
        showToast("Appointment updated successfully", "success");
        onSuccess();
        onClose();
      } catch (err: any) {
        dialogs.error(err.message || "Failed to update appointment");
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      safetyClose={true}
      onClose={onClose}
      title={mode === "add" ? "Book Appointment" : "Edit Appointment"}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Client Select */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Client *
          </label>
          <Controller
            name="clientId"
            control={control}
            render={({ field }) => (
              <ClientSelect
                value={field.value === 0 ? null : field.value}
                onChange={(val) => field.onChange(val ?? 0)}
              />
            )}
          />
          {errors.clientId && <p className="text-xs text-red-500 mt-1">{errors.clientId.message}</p>}
        </div>

        {/* Treatment Select */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Treatment *
          </label>
          <Controller
            name="treatmentId"
            control={control}
            render={({ field }) => (
              <TreatmentSelect
                value={field.value === 0 ? null : field.value}
                onChange={(val) => field.onChange(val ?? 0)}
              />
            )}
          />
          {errors.treatmentId && <p className="text-xs text-red-500 mt-1">{errors.treatmentId.message}</p>}
        </div>

        {/* Assigned Staff (optional) */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Assigned Staff (optional)
          </label>
          <Controller
            name="assignedStaffId"
            control={control}
            render={({ field }) => (
              <StaffSelect
                value={field.value ?? null}
                onChange={(val) => field.onChange(val ?? null)}
              />
            )}
          />
        </div>

        {/* Appointment Date & Time */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Appointment Date & Time *
          </label>
          <input
            type="datetime-local"
            {...register("appointmentDateTime")}
            className="compact-input w-full border rounded-md px-3 py-2"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
            }}
          />
          {errors.appointmentDateTime && (
            <p className="text-xs text-red-500 mt-1">{errors.appointmentDateTime.message}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Notes
          </label>
          <textarea
            {...register("notes")}
            rows={3}
            className="compact-input w-full border rounded-md px-3 py-2"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border-color)",
            }}
            placeholder="Any special requests or notes..."
          />
        </div>

        {/* Status (only for edit mode) */}
        {mode === "edit" && (
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
              Status
            </label>
            <select
              {...register("status")}
              className="compact-input w-full border rounded-md px-3 py-2"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--border-color)",
              }}
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="NoShow">No-Show</option>
            </select>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-color)]">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="success" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : mode === "add"
              ? "Create Appointment"
              : "Update Appointment"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AppointmentFormDialog;