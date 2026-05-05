// src/api/appointment.ts
import { apiClient } from "../../lib/fetcher";
import type { ApiResponse, PaginatedResult } from "./types";

// ---------- DTOs ----------
export interface AppointmentResponseDto {
  id: number;
  clientId: number;
  clientName?: string;
  treatmentId: number;
  treatmentName?: string;
  assignedStaff?: string;
  appointmentDateTime: string;
  durationMinutes: number;
  notes?: string;
  status?: string;
  createdAt: string;
}

export interface CreateAppointmentDto {
  clientId: number;
  treatmentId: number;
  assignedStaff?: string;
  appointmentDateTime: string;
  notes?: string;
}

export interface UpdateAppointmentDto {
  clientId?: number;
  treatmentId?: number;
  assignedStaff?: string;
  appointmentDateTime?: string;
  notes?: string;
}

export interface UpdateAppointmentStatusDto {
  status: string;
}

// ---------- API methods ----------
class AppointmentAPI {
  private basePath = "/api/v1/Appointments";

  // GET /api/v1/Appointments
  async getAppointments(params?: {
    page?: number;
    pageSize?: number;
    clientId?: number;
    status?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<ApiResponse<PaginatedResult<AppointmentResponseDto>>> {
    const res = await apiClient.get<ApiResponse<PaginatedResult<AppointmentResponseDto>>>(
      this.basePath,
      { params }
    );
    return res.data;
  }

  // POST /api/v1/Appointments
  async createAppointment(data: CreateAppointmentDto): Promise<ApiResponse<AppointmentResponseDto>> {
    const res = await apiClient.post<ApiResponse<AppointmentResponseDto>>(this.basePath, data);
    return res.data;
  }

  // GET /api/v1/Appointments/{id}
  async getAppointment(id: number): Promise<ApiResponse<AppointmentResponseDto>> {
    const res = await apiClient.get<ApiResponse<AppointmentResponseDto>>(`${this.basePath}/${id}`);
    return res.data;
  }

  // PUT /api/v1/Appointments/{id}
  async updateAppointment(id: number, data: UpdateAppointmentDto): Promise<ApiResponse<AppointmentResponseDto>> {
    const res = await apiClient.put<ApiResponse<AppointmentResponseDto>>(`${this.basePath}/${id}`, data);
    return res.data;
  }

  // DELETE /api/v1/Appointments/{id}
  async deleteAppointment(id: number): Promise<ApiResponse<boolean>> {
    const res = await apiClient.delete<ApiResponse<boolean>>(`${this.basePath}/${id}`);
    return res.data;
  }

  // PATCH /api/v1/Appointments/{id}/status
  async updateAppointmentStatus(id: number, data: UpdateAppointmentStatusDto): Promise<ApiResponse<boolean>> {
    const res = await apiClient.patch<ApiResponse<boolean>>(`${this.basePath}/${id}/status`, data);
    return res.data;
  }

  // GET /api/v1/Appointments/client/{clientId}
  async getAppointmentsByClient(clientId: number): Promise<ApiResponse<AppointmentResponseDto[]>> {
    const res = await apiClient.get<ApiResponse<AppointmentResponseDto[]>>(`${this.basePath}/client/${clientId}`);
    return res.data;
  }

  // GET /api/v1/Appointments/daterange
  async getAppointmentsByDateRange(start?: string, end?: string): Promise<ApiResponse<AppointmentResponseDto[]>> {
    const res = await apiClient.get<ApiResponse<AppointmentResponseDto[]>>(`${this.basePath}/daterange`, {
      params: { start, end },
    });
    return res.data;
  }
}
const appointmentApi = new AppointmentAPI();
export default appointmentApi;