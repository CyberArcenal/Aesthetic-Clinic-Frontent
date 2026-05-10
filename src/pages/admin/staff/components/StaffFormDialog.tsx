// src/pages/staff/components/StaffFormDialog.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { showToast } from "@/utils/notification";
import { dialogs } from "@/utils/dialogs";
import staffApi, { StaffResponseDto, CreateStaffDto, UpdateStaffDto } from "@/api/core/staff";

interface StaffFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  staffId: number | null;
  initialData: Partial<StaffResponseDto> | null;
  onClose: () => void;
  onSuccess: () => void;
}

// Predefined positions list
const POSITIONS = [
  { value: "Admin", label: "Administrator" },
  { value: "Doctor", label: "Doctor" },
  { value: "Aesthetician", label: "Aesthetician" },
  { value: "Nurse", label: "Nurse" },
  { value: "Receptionist", label: "Receptionist" },
  { value: "Marketing Staff", label: "Marketing Staff" },
  { value: "Therapist", label: "Therapist" },
  { value: "Technician", label: "Technician" },
  { value: "Other", label: "Other" },
];

const staffSchema = z.object({
  name: z.string().min(1, "Staff name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  position: z.string().optional(),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof staffSchema>;

const StaffFormDialog: React.FC<StaffFormDialogProps> = ({
  isOpen,
  mode,
  staffId,
  initialData,
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      isActive: true,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (initialData && mode === "edit") {
      reset({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        position: initialData.position || "",
        isActive: initialData.isActive ?? true,
      });
    } else {
      reset({
        name: "",
        email: "",
        phone: "",
        position: "",
        isActive: true,
      });
    }
  }, [initialData, mode, reset]);

  const onSubmit = async (data: FormValues) => {
    if (mode === "add") {
      try {
        const createData: CreateStaffDto = {
          name: data.name,
          email: data.email || undefined,
          phone: data.phone || undefined,
          position: data.position || undefined,
          isActive: data.isActive,
        };
        await staffApi.createStaff(createData);
        showToast("Staff member created successfully", "success");
        onSuccess();
        onClose();
      } catch (err: any) {
        dialogs.error(err.message || "Failed to create staff member");
      }
    } else if (mode === "edit" && staffId) {
      try {
        const updateData: UpdateStaffDto = {
          name: data.name,
          email: data.email || undefined,
          phone: data.phone || undefined,
          position: data.position || undefined,
          isActive: data.isActive,
        };
        await staffApi.updateStaffMember(staffId, updateData);
        showToast("Staff member updated successfully", "success");
        onSuccess();
        onClose();
      } catch (err: any) {
        dialogs.error(err.message || "Failed to update staff member");
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      safetyClose
      onClose={onClose}
      title={mode === "add" ? "Add Staff Member" : "Edit Staff Member"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Full Name *
          </label>
          <input
            type="text"
            {...register("name")}
            className="compact-input w-full border rounded-md px-3 py-2"
            style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
            placeholder="e.g., Dr. Jane Smith"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Email Address
          </label>
          <input
            type="email"
            {...register("email")}
            className="compact-input w-full border rounded-md px-3 py-2"
            style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
            placeholder="staff@clinic.com"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Phone Number
          </label>
          <input
            type="tel"
            {...register("phone")}
            className="compact-input w-full border rounded-md px-3 py-2"
            style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
            placeholder="+63 912 345 6789"
          />
        </div>

        {/* Position as select dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
            Position / Role
          </label>
          <select
            {...register("position")}
            className="compact-input w-full border rounded-md px-3 py-2"
            style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
          >
            <option value="">-- Select position --</option>
            {POSITIONS.map((pos) => (
              <option key={pos.value} value={pos.value}>
                {pos.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm" style={{ color: "var(--sidebar-text)" }}>
            <input type="checkbox" {...register("isActive")} className="w-4 h-4" />
            Active (can be assigned to appointments)
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-color)]">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="success" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : mode === "add" ? "Create Staff" : "Update Staff"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StaffFormDialog;