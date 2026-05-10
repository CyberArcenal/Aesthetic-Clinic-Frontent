// src/pages/users/components/UserFormDialog.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { showToast } from "@/utils/notification";
import { dialogs } from "@/utils/dialogs";
import userApi, { CreateUserDto, UpdateUserDto, UserResponseDto } from "@/api/core/user";
import roleApi, { RoleResponseDto } from "@/api/core/role";

interface UserFormDialogProps {
  isOpen: boolean;
  mode: "add" | "edit";
  userId: number | null;
  initialData: Partial<UserResponseDto> | null;
  onClose: () => void;
  onSuccess: () => void;
}

// Schema – all fields explicitly typed
const userSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    fullName: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    isActive: z.boolean(),
    roles: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

type FormValues = z.infer<typeof userSchema>;

const UserFormDialog: React.FC<UserFormDialogProps> = ({
  isOpen,
  mode,
  userId,
  initialData,
  onClose,
  onSuccess,
}) => {
  const [availableRoles, setAvailableRoles] = React.useState<RoleResponseDto[]>([]);
  const [loadingRoles, setLoadingRoles] = React.useState(false);
  const [rolesError, setRolesError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
      isActive: true,
      roles: [],
    },
  });

  const selectedRoles = watch("roles") || [];

  // Fetch available roles
  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      try {
        const res = await roleApi.getRoles();
        if (res.success) {
          setAvailableRoles(res.data);
        } else {
          throw new Error(res.message || "Failed to load roles");
        }
      } catch (err: any) {
        setRolesError(err.message);
      } finally {
        setLoadingRoles(false);
      }
    };
    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen]);

  // Populate form when editing
  useEffect(() => {
    if (initialData && mode === "edit") {
      reset({
        username: initialData.username || "",
        email: initialData.email || "",
        fullName: initialData.fullName || "",
        password: "",
        confirmPassword: "",
        isActive: initialData.isActive ?? true,
        roles: initialData.roles || [],
      });
    } else {
      reset({
        username: "",
        email: "",
        fullName: "",
        password: "",
        confirmPassword: "",
        isActive: true,
        roles: [],
      });
    }
  }, [initialData, mode, reset]);

  const handleRoleToggle = (roleName: string) => {
    const current = selectedRoles;
    if (current.includes(roleName)) {
      setValue("roles", current.filter(r => r !== roleName));
    } else {
      setValue("roles", [...current, roleName]);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (mode === "add") {
      if (!data.password) {
        dialogs.error("Password is required for new users");
        return;
      }
      try {
        const createData: CreateUserDto = {
          username: data.username,
          email: data.email,
          password: data.password,
          fullName: data.fullName || undefined,
          isActive: data.isActive,
          roles: data.roles || [],
        };
        await userApi.createUser(createData);
        showToast("User created successfully", "success");
        onSuccess();
        onClose();
      } catch (err: any) {
        dialogs.error(err.message || "Failed to create user");
      }
    } else if (mode === "edit" && userId) {
      try {
        const originalRoles = initialData?.roles || [];
        const newRoles = data.roles || [];
        const rolesToAdd = newRoles.filter(r => !originalRoles.includes(r));
        const rolesToRemove = originalRoles.filter(r => !newRoles.includes(r));
        const updateData: UpdateUserDto = {
          username: data.username,
          email: data.email,
          fullName: data.fullName || undefined,
          isActive: data.isActive,
          rolesToAdd: rolesToAdd.length ? rolesToAdd : undefined,
          rolesToRemove: rolesToRemove.length ? rolesToRemove : undefined,
        };
        await userApi.updateUser(userId, updateData);
        showToast("User updated successfully", "success");
        onSuccess();
        onClose();
      } catch (err: any) {
        dialogs.error(err.message || "Failed to update user");
      }
    }
  };

  return (
    <Modal isOpen={isOpen} safetyClose onClose={onClose} title={mode === "add" ? "Add User" : "Edit User"} size="lg">
      {rolesError ? (
        <div className="p-4 text-red-500">Error loading roles: {rolesError}</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
              Username *
            </label>
            <input
              type="text"
              {...register("username")}
              className="compact-input w-full border rounded-md px-3 py-2"
              style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
            />
            {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
              Email *
            </label>
            <input
              type="email"
              {...register("email")}
              className="compact-input w-full border rounded-md px-3 py-2"
              style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
              Full Name
            </label>
            <input
              type="text"
              {...register("fullName")}
              className="compact-input w-full border rounded-md px-3 py-2"
              style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
            />
          </div>

          {/* Password fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
                {mode === "add" ? "Password *" : "Password (leave blank to keep current)"}
              </label>
              <input
                type="password"
                {...register("password")}
                className="compact-input w-full border rounded-md px-3 py-2"
                style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--sidebar-text)" }}>
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                className="compact-input w-full border rounded-md px-3 py-2"
                style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--border-color)" }}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {/* Active Status */}
          <div>
            <label className="flex items-center gap-2 text-sm" style={{ color: "var(--sidebar-text)" }}>
              <input type="checkbox" {...register("isActive")} className="w-4 h-4" />
              Active (can log in)
            </label>
          </div>

          {/* Roles */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: "var(--sidebar-text)" }}>
              Roles
            </label>
            {loadingRoles ? (
              <div className="text-sm text-gray-500">Loading roles...</div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {availableRoles.map((role) => (
                  <label key={role.id} className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role.name || "")}
                      onChange={() => handleRoleToggle(role.name || "")}
                      className="w-4 h-4"
                    />
                    {role.name}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[var(--border-color)]">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="success" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : mode === "add" ? "Create User" : "Update User"}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default UserFormDialog;