// src/api/user.ts
import { apiClient } from "../../lib/fetcher";
import type { ApiResponse, PaginatedResult } from "./types";

export interface UserResponseDto {
  id: number;
  username?: string;
  email?: string;
  fullName?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  roles?: string[];
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  isActive?: boolean;
  roles?: string[];
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  fullName?: string;
  isActive?: boolean;
  rolesToAdd?: string[];
  rolesToRemove?: string[];
}

class UserAPI {
  private basePath = "/api/v1/users";

  // GET /api/v1/users?page=1&pageSize=10&search=...
  async getUsers(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<ApiResponse<PaginatedResult<UserResponseDto>>> {
    const res = await apiClient.get<ApiResponse<PaginatedResult<UserResponseDto>>>(
      this.basePath,
      { params }
    );
    return res.data;
  }

  // GET /api/v1/users/{id}
  async getUser(id: number): Promise<ApiResponse<UserResponseDto>> {
    const res = await apiClient.get<ApiResponse<UserResponseDto>>(`${this.basePath}/${id}`);
    return res.data;
  }

  // POST /api/v1/users
  async createUser(data: CreateUserDto): Promise<ApiResponse<UserResponseDto>> {
    const res = await apiClient.post<ApiResponse<UserResponseDto>>(this.basePath, data);
    return res.data;
  }

  // PUT /api/v1/users/{id}
  async updateUser(id: number, data: UpdateUserDto): Promise<ApiResponse<UserResponseDto>> {
    const res = await apiClient.put<ApiResponse<UserResponseDto>>(`${this.basePath}/${id}`, data);
    return res.data;
  }

  // DELETE /api/v1/users/{id}
  async deleteUser(id: number): Promise<ApiResponse<boolean>> {
    const res = await apiClient.delete<ApiResponse<boolean>>(`${this.basePath}/${id}`);
    return res.data;
  }

  // PATCH /api/v1/users/{id}/activate?isActive=true
  async activateUser(id: number, isActive: boolean = true): Promise<ApiResponse<boolean>> {
    const res = await apiClient.patch<ApiResponse<boolean>>(`${this.basePath}/${id}/activate`, null, {
      params: { isActive },
    });
    return res.data;
  }
}

const userApi = new UserAPI();
export default userApi;