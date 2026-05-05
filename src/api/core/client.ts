// src/api/client.ts
import { apiClient } from "../../lib/fetcher";
import type { ApiResponse, PaginatedResult } from "./types";

// ---------- DTOs ----------
export interface ClientResponseDto {
  id: number;
  firstName?: string;
  lastName?: string;
  fullName?: string;      // computed by backend, read-only
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;   // ISO date string
  skinHistory?: string;
  allergies?: string;
  createdAt: string;
}

export interface CreateClientDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  skinHistory?: string;
  allergies?: string;
}

export interface UpdateClientDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  skinHistory?: string;
  allergies?: string;
}

// ---------- API methods ----------
class ClientAPI {
  private basePath = "/api/v1/Clients";

  // GET /api/v1/Clients?page=1&pageSize=10&search=...
  async getClients(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<ApiResponse<PaginatedResult<ClientResponseDto>>> {
    const res = await apiClient.get<ApiResponse<PaginatedResult<ClientResponseDto>>>(
      this.basePath,
      { params }
    );
    return res.data;
  }

  // POST /api/v1/Clients
  async createClient(data: CreateClientDto): Promise<ApiResponse<ClientResponseDto>> {
    const res = await apiClient.post<ApiResponse<ClientResponseDto>>(this.basePath, data);
    return res.data;
  }

  // GET /api/v1/Clients/{id}
  async getClient(id: number): Promise<ApiResponse<ClientResponseDto>> {
    const res = await apiClient.get<ApiResponse<ClientResponseDto>>(`${this.basePath}/${id}`);
    return res.data;
  }

  // PUT /api/v1/Clients/{id}
  async updateClient(id: number, data: UpdateClientDto): Promise<ApiResponse<ClientResponseDto>> {
    const res = await apiClient.put<ApiResponse<ClientResponseDto>>(`${this.basePath}/${id}`, data);
    return res.data;
  }

  // DELETE /api/v1/Clients/{id}
  async deleteClient(id: number): Promise<ApiResponse<boolean>> {
    const res = await apiClient.delete<ApiResponse<boolean>>(`${this.basePath}/${id}`);
    return res.data;
  }
}
const clientApi = new ClientAPI();
export default clientApi;