// src/pages/users/hooks/useUsers.ts
import userApi, { UserResponseDto } from "@/api/core/user";
import { useState, useEffect, useCallback, useMemo } from "react";

export interface UserFilters {
  search: string;
  role: string;
  activeOnly: boolean;
}

interface UseUsersReturn {
  users: UserResponseDto[];
  paginatedUsers: UserResponseDto[];
  filters: UserFilters;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
  };
  selectedUsers: number[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<number[]>>;
  sortConfig: { key: keyof UserResponseDto; direction: "asc" | "desc" };
  setSortConfig: React.Dispatch<React.SetStateAction<{ key: keyof UserResponseDto; direction: "asc" | "desc" }>>;
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  reload: () => void;
  handleFilterChange: (key: keyof UserFilters, value: any) => void;
  resetFilters: () => void;
  toggleUserSelection: (id: number) => void;
  toggleSelectAll: () => void;
  handleSort: (key: keyof UserResponseDto) => void;
  rolesList: string[];
}

const useUsers = (): UseUsersReturn => {
  const [allUsers, setAllUsers] = useState<UserResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof UserResponseDto; direction: "asc" | "desc" }>({
    key: "username",
    direction: "asc",
  });
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    role: "",
    activeOnly: false,
  });
  const [rolesList, setRolesList] = useState<string[]>([]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userApi.getUsers({ page: 1, pageSize: 1000, search: filters.search || undefined });
      if (!res.success) throw new Error(res.message || "Failed to fetch users");
      let items = res.data.items;
      // Client‑side filter by role & activeOnly
      if (filters.role) {
        items = items.filter((u) => u.roles?.includes(filters.role));
      }
      if (filters.activeOnly) {
        items = items.filter((u) => u.isActive === true);
      }
      setAllUsers(items);
      setSelectedUsers([]);
      // Extract unique roles
      const rolesSet = new Set<string>();
      items.forEach((u) => u.roles?.forEach((r) => rolesSet.add(r)));
      setRolesList(Array.from(rolesSet).sort());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.role, filters.activeOnly]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Sorting
  const sortedUsers = useMemo(() => {
    const sorted = [...allUsers];
    const { key, direction } = sortConfig;
    if (key) {
      sorted.sort((a, b) => {
        let aVal: any = a[key];
        let bVal: any = b[key];
        if (key === "username" || key === "email" || key === "fullName") {
          aVal = (aVal || "").toLowerCase();
          bVal = (bVal || "").toLowerCase();
        } else if (key === "createdAt" || key === "lastLoginAt") {
          aVal = aVal ? new Date(aVal).getTime() : 0;
          bVal = bVal ? new Date(bVal).getTime() : 0;
        }
        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [allUsers, sortConfig]);

  const totalItems = sortedUsers.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFilterChange = useCallback((key: keyof UserFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ search: "", role: "", activeOnly: false });
    setCurrentPage(1);
  }, []);

  const toggleUserSelection = useCallback((id: number) => {
    setSelectedUsers((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedUsers((prev) =>
      prev.length === paginatedUsers.length ? [] : paginatedUsers.map((u) => u.id)
    );
  }, [paginatedUsers]);

  const handleSort = useCallback((key: keyof UserResponseDto) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  }, []);

  const reload = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  const setPageSizeHandler = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  return {
    users: sortedUsers,
    paginatedUsers,
    filters,
    loading,
    error,
    pagination: {
      currentPage,
      totalPages,
      totalCount: totalItems,
      pageSize,
    },
    selectedUsers,
    setSelectedUsers,
    sortConfig,
    setSortConfig,
    pageSize,
    setPageSize: setPageSizeHandler,
    currentPage,
    setCurrentPage,
    reload,
    handleFilterChange,
    resetFilters,
    toggleUserSelection,
    toggleSelectAll,
    handleSort,
    rolesList,
  };
};

export default useUsers;