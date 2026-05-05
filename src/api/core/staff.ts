// src/api/staff.ts
import { apiClient } from "../../lib/fetcher";
import type { ApiResponse, PaginatedResult } from "./types";

// ---------- DTOs ----------
export interface StaffResponseDto {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateStaffDto {
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  isActive?: boolean;
}

export interface UpdateStaffDto {
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  isActive?: boolean;
}

// ---------- API methods ----------
class StaffAPI {
  private basePath = "/api/v1/Staff";

  // GET /api/v1/Staff?page=1&pageSize=10&search=...
  async getStaff(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<ApiResponse<PaginatedResult<StaffResponseDto>>> {
    const res = await apiClient.get<ApiResponse<PaginatedResult<StaffResponseDto>>>(
      this.basePath,
      { params }
    );
    return res.data;
  }

  // POST /api/v1/Staff
  async createStaff(data: CreateStaffDto): Promise<ApiResponse<StaffResponseDto>> {
    const res = await apiClient.post<ApiResponse<StaffResponseDto>>(this.basePath, data);
    return res.data;
  }

  // GET /api/v1/Staff/{id}
  async getStaffMember(id: number): Promise<ApiResponse<StaffResponseDto>> {
    const res = await apiClient.get<ApiResponse<StaffResponseDto>>(`${this.basePath}/${id}`);
    return res.data;
  }

  // PUT /api/v1/Staff/{id}
  async updateStaffMember(id: number, data: UpdateStaffDto): Promise<ApiResponse<StaffResponseDto>> {
    const res = await apiClient.put<ApiResponse<StaffResponseDto>>(`${this.basePath}/${id}`, data);
    return res.data;
  }

  // DELETE /api/v1/Staff/{id}
  async deleteStaffMember(id: number): Promise<ApiResponse<boolean>> {
    const res = await apiClient.delete<ApiResponse<boolean>>(`${this.basePath}/${id}`);
    return res.data;
  }

  // PATCH /api/v1/Staff/{id}/toggle-active
  async toggleStaffActive(id: number): Promise<ApiResponse<boolean>> {
    const res = await apiClient.patch<ApiResponse<boolean>>(`${this.basePath}/${id}/toggle-active`);
    return res.data;
  }

  // GET /api/v1/Staff/active
  async getActiveStaff(): Promise<ApiResponse<StaffResponseDto[]>> {
    const res = await apiClient.get<ApiResponse<StaffResponseDto[]>>(`${this.basePath}/active`);
    return res.data;
  }

  // GET /api/v1/Staff/position/{position}
  async getStaffByPosition(position: string): Promise<ApiResponse<StaffResponseDto[]>> {
    const res = await apiClient.get<ApiResponse<StaffResponseDto[]>>(`${this.basePath}/position/${position}`);
    return res.data;
  }
}
const staffApi = new StaffAPI();
export default staffApi;