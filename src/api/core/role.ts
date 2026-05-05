// src/api/role.ts
import { apiClient } from "../../lib/fetcher";
import type { ApiResponse } from "./types";

export interface RoleResponseDto {
  id: number;
  name?: string;
  description?: string;
  createdAt: string;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
}

export interface AssignRoleDto {
  userId: number;
  roleId: number;
}

class RoleAPI {
  private basePath = "/api/v1/roles";

  // GET /api/v1/roles
  async getRoles(): Promise<ApiResponse<RoleResponseDto[]>> {
    const res = await apiClient.get<ApiResponse<RoleResponseDto[]>>(this.basePath);
    return res.data;
  }

  // GET /api/v1/roles/{id}
  async getRole(id: number): Promise<ApiResponse<RoleResponseDto>> {
    const res = await apiClient.get<ApiResponse<RoleResponseDto>>(`${this.basePath}/${id}`);
    return res.data;
  }

  // POST /api/v1/roles
  async createRole(data: CreateRoleDto): Promise<ApiResponse<RoleResponseDto>> {
    const res = await apiClient.post<ApiResponse<RoleResponseDto>>(this.basePath, data);
    return res.data;
  }

  // PUT /api/v1/roles/{id}
  async updateRole(id: number, data: UpdateRoleDto): Promise<ApiResponse<RoleResponseDto>> {
    const res = await apiClient.put<ApiResponse<RoleResponseDto>>(`${this.basePath}/${id}`, data);
    return res.data;
  }

  // DELETE /api/v1/roles/{id}
  async deleteRole(id: number): Promise<ApiResponse<boolean>> {
    const res = await apiClient.delete<ApiResponse<boolean>>(`${this.basePath}/${id}`);
    return res.data;
  }

  // POST /api/v1/roles/assign
  async assignRole(data: AssignRoleDto): Promise<ApiResponse<boolean>> {
    const res = await apiClient.post<ApiResponse<boolean>>(`${this.basePath}/assign`, data);
    return res.data;
  }

  // POST /api/v1/roles/remove
  async removeRole(data: AssignRoleDto): Promise<ApiResponse<boolean>> {
    const res = await apiClient.post<ApiResponse<boolean>>(`${this.basePath}/remove`, data);
    return res.data;
  }

  // GET /api/v1/roles/user/{userId}
  async getUserRoles(userId: number): Promise<ApiResponse<string[]>> {
    const res = await apiClient.get<ApiResponse<string[]>>(`${this.basePath}/user/${userId}`);
    return res.data;
  }
}
const roleApi = new RoleAPI();
export default roleApi;