// src/pages/clients/components/ClientFormDialog.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { ClientResponseDto, CreateClientDto } from "../../../../api/core/client";
import { hideLoading, showLoading, showToast } from "../../../../utils/notification";
import clientApi from "../../../../api/core/client";
import { dialogs } from "../../../../utils/dialogs";
import Modal from "../../../../components/UI/Modal";
import Button from "../../../../components/UI/Button";

interface ClientFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  clientId: number | null;
  initialData: Partial<ClientResponseDto> | null;
  onClose: () => void;
  onSuccess: () => void;
}

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  skinHistory: string;
  allergies: string;
};

const ClientFormDialog: React.FC<ClientFormDialogProps> = ({
  isOpen,
  mode,
  clientId,
  initialData,
  onClose,
  onSuccess,
}) => {
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      skinHistory: "",
      allergies: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        phoneNumber: initialData.phoneNumber || "",
        dateOfBirth: initialData.dateOfBirth?.split("T")[0] || "",
        skinHistory: initialData.skinHistory || "",
        allergies: initialData.allergies || "",
      });
    } else {
      reset();
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      showLoading(mode === "add" ? "Creating client..." : "Updating client...");
      if (mode === "add") {
        await clientApi.createClient(data as CreateClientDto);
        showToast("Client created successfully", "success");
      } else {
        if (!clientId) throw new Error("Client ID missing");
        await clientApi.updateClient(clientId, data);
        showToast("Client updated successfully", "success");
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      dialogs.alert({ title: "Error", message: err.message, icon: "danger" });
    } finally {
      hideLoading();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === "add" ? "Add New Client" : "Edit Client"} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>First Name *</label>
            <input {...register("firstName", { required: "First name is required" })} className="compact-input w-full border rounded-md px-3 py-2" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }} />
            {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>Last Name *</label>
            <input {...register("lastName", { required: "Last name is required" })} className="compact-input w-full border rounded-md px-3 py-2" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }} />
            {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>Email *</label>
          <input type="email" {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } })} className="compact-input w-full border rounded-md px-3 py-2" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>Phone Number</label>
          <input {...register("phoneNumber")} className="compact-input w-full border rounded-md px-3 py-2" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>Date of Birth</label>
          <input type="date" {...register("dateOfBirth")} className="compact-input w-full border rounded-md px-3 py-2" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>Skin History</label>
          <textarea {...register("skinHistory")} rows={2} className="compact-input w-full border rounded-md px-3 py-2" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>Allergies</label>
          <textarea {...register("allergies")} rows={2} className="compact-input w-full border rounded-md px-3 py-2" style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)", color: "var(--sidebar-text)" }} />
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-color)]">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="success" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : mode === "add" ? "Create" : "Update"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ClientFormDialog;