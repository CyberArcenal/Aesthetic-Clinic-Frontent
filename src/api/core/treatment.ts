// src/api/treatment.ts
import { apiClient } from "../../lib/fetcher";
import type { ApiResponse, PaginatedResult } from "./types";

// ---------- DTOs ----------
export interface TreatmentResponseDto {
  id: number;
  name?: string;
  description?: string;
  category?: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  createdAt: string;
}

export interface CreateTreatmentDto {
  name: string;
  description?: string;
  category?: string;
  durationMinutes: number;
  price: number;
  isActive?: boolean;
}

export interface UpdateTreatmentDto {
  name?: string;
  description?: string;
  category?: string;
  durationMinutes?: number;
  price?: number;
  isActive?: boolean;
}

// ---------- API methods ----------
class TreatmentAPI {
  private basePath = "/api/v1/Treatments";

  // GET /api/v1/Treatments?page=1&pageSize=10&search=...
  async getTreatments(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<ApiResponse<PaginatedResult<TreatmentResponseDto>>> {
    const res = await apiClient.get<ApiResponse<PaginatedResult<TreatmentResponseDto>>>(
      this.basePath,
      { params }
    );
    return res.data;
  }

  // POST /api/v1/Treatments
  async createTreatment(data: CreateTreatmentDto): Promise<ApiResponse<TreatmentResponseDto>> {
    const res = await apiClient.post<ApiResponse<TreatmentResponseDto>>(this.basePath, data);
    return res.data;
  }

  // GET /api/v1/Treatments/{id}
  async getTreatment(id: number): Promise<ApiResponse<TreatmentResponseDto>> {
    const res = await apiClient.get<ApiResponse<TreatmentResponseDto>>(`${this.basePath}/${id}`);
    return res.data;
  }

  // PUT /api/v1/Treatments/{id}
  async updateTreatment(id: number, data: UpdateTreatmentDto): Promise<ApiResponse<TreatmentResponseDto>> {
    const res = await apiClient.put<ApiResponse<TreatmentResponseDto>>(`${this.basePath}/${id}`, data);
    return res.data;
  }

  // DELETE /api/v1/Treatments/{id}
  async deleteTreatment(id: number): Promise<ApiResponse<boolean>> {
    const res = await apiClient.delete<ApiResponse<boolean>>(`${this.basePath}/${id}`);
    return res.data;
  }

  // PATCH /api/v1/Treatments/{id}/toggle-active
  async toggleTreatmentActive(id: number): Promise<ApiResponse<boolean>> {
    const res = await apiClient.patch<ApiResponse<boolean>>(`${this.basePath}/${id}/toggle-active`);
    return res.data;
  }

  // GET /api/v1/Treatments/active
  async getActiveTreatments(): Promise<ApiResponse<TreatmentResponseDto[]>> {
    const res = await apiClient.get<ApiResponse<TreatmentResponseDto[]>>(`${this.basePath}/active`);
    return res.data;
  }

  // GET /api/v1/Treatments/category/{category}
  async getTreatmentsByCategory(category: string): Promise<ApiResponse<TreatmentResponseDto[]>> {
    const res = await apiClient.get<ApiResponse<TreatmentResponseDto[]>>(`${this.basePath}/category/${category}`);
    return res.data;
  }
}

const treatmentApi = new TreatmentAPI();
export default treatmentApi;