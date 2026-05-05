// src/api/photos.ts
import { apiClient } from "../../lib/fetcher";
import type { ApiResponse } from "./types";

// ---------- DTOs ----------
export interface PhotoResponseDto {
  id: number;
  clientId: number;
  clientName?: string;
  appointmentId?: number;
  fileName?: string;
  filePath?: string;       // URL to access the photo (if served via static files or cloud)
  description?: string;
  isBefore: boolean;       // true = before treatment, false = after
  fileSize: number;
  mimeType?: string;
  createdAt: string;
}

export interface CreatePhotoDto {
  clientId: number;
  appointmentId?: number;
  isBefore: boolean;       // required
  description?: string;
  file: File;              // actual file to upload
}

// ---------- API methods ----------
class PhotoAPI {
  private basePath = "/api/v1/Photos";

  // GET /api/v1/Photos/client/{clientId}
  async getPhotosByClient(clientId: number): Promise<ApiResponse<PhotoResponseDto[]>> {
    const res = await apiClient.get<ApiResponse<PhotoResponseDto[]>>(`${this.basePath}/client/${clientId}`);
    return res.data;
  }

  // GET /api/v1/Photos/client/{clientId}/before
  async getBeforePhotos(clientId: number): Promise<ApiResponse<PhotoResponseDto[]>> {
    const res = await apiClient.get<ApiResponse<PhotoResponseDto[]>>(`${this.basePath}/client/${clientId}/before`);
    return res.data;
  }

  // GET /api/v1/Photos/client/{clientId}/after
  async getAfterPhotos(clientId: number): Promise<ApiResponse<PhotoResponseDto[]>> {
    const res = await apiClient.get<ApiResponse<PhotoResponseDto[]>>(`${this.basePath}/client/${clientId}/after`);
    return res.data;
  }

  // GET /api/v1/Photos/{id}
  async getPhoto(id: number): Promise<ApiResponse<PhotoResponseDto>> {
    const res = await apiClient.get<ApiResponse<PhotoResponseDto>>(`${this.basePath}/${id}`);
    return res.data;
  }

  // DELETE /api/v1/Photos/{id}
  async deletePhoto(id: number): Promise<ApiResponse<boolean>> {
    const res = await apiClient.delete<ApiResponse<boolean>>(`${this.basePath}/${id}`);
    return res.data;
  }

  // POST /api/v1/Photos (multipart/form-data)
  async uploadPhoto(data: CreatePhotoDto): Promise<ApiResponse<PhotoResponseDto>> {
    const formData = new FormData();
    formData.append("ClientId", data.clientId.toString());
    if (data.appointmentId !== undefined && data.appointmentId !== null) {
      formData.append("AppointmentId", data.appointmentId.toString());
    }
    formData.append("IsBefore", data.isBefore.toString());
    if (data.description) {
      formData.append("Description", data.description);
    }
    formData.append("File", data.file);
    const res = await apiClient.post<ApiResponse<PhotoResponseDto>>(this.basePath, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }

  // GET /api/v1/Photos/file/{id}
  // This endpoint returns the actual image file (blob). Useful for downloading or displaying.
  async getPhotoFile(id: number): Promise<Blob> {
    const res = await apiClient.get(`${this.basePath}/file/${id}`, {
      responseType: "blob",
    });
    return res.data;
  }
}
const photoApi = new PhotoAPI();
export default photoApi;