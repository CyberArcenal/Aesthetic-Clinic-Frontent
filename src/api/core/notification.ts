// src/api/notification.ts
import { apiClient } from "../../lib/fetcher";
import type { ApiResponse, PaginatedResult } from "./types";

// ========== Notification DTOs ==========
export interface NotificationResponseDto {
  metadata: JSON;
  id: number;
  recipientId: number;
  recipientName?: string;
  title?: string;
  message?: string;
  type?: string;
  channel?: string;
  isRead: boolean;
  readAt?: string;
  actionUrl?: string;
  createdAt: string;
}

// ========== Notification Template DTOs ==========
export interface NotificationTemplateResponseDto {
  id: number;
  name?: string;
  subject?: string;
  content?: string;
  createdAt: string;
}

export interface CreateNotificationTemplateDto {
  name: string;
  subject: string;
  content: string;
}

export interface UpdateNotificationTemplateDto {
  name?: string;
  subject?: string;
  content?: string;
}

// ========== Notify Log DTOs ==========
export interface NotifyLogResponseDto {
  id: number;
  recipientEmail?: string;
  subject?: string;
  payload?: string;
  type?: string;
  status?: string;
  errorMessage?: string;
  channel?: string;
  messageId?: string;
  durationMs?: number;
  sentAt?: string;
  createdAt: string;
}

// ========== API Client ==========
class NotificationAPI {
  // ----- In-App Notifications -----
  private notifPath = "/api/v1/notifications";

  async getUserNotifications(
    userId: number,
    limit?: number,
  ): Promise<ApiResponse<NotificationResponseDto[]>> {
    const res = await apiClient.get<ApiResponse<NotificationResponseDto[]>>(
      `${this.notifPath}/user/${userId}`,
      { params: { limit } },
    );
    return res.data;
  }
  async getNotification(
    id: number,
  ): Promise<ApiResponse<NotificationResponseDto>> {
    const res = await apiClient.get<ApiResponse<NotificationResponseDto>>(
      `${this.notifPath}/${id}`,
    );
    return res.data;
  }

  async getUserUnreadNotifications(
    userId: number,
  ): Promise<ApiResponse<NotificationResponseDto[]>> {
    const res = await apiClient.get<ApiResponse<NotificationResponseDto[]>>(
      `${this.notifPath}/user/${userId}/unread`,
    );
    return res.data;
  }

  async getUserUnreadCount(userId: number): Promise<ApiResponse<number>> {
    const res = await apiClient.get<ApiResponse<number>>(
      `${this.notifPath}/user/${userId}/unread-count`,
    );
    return res.data;
  }

  async markNotificationRead(id: number): Promise<ApiResponse<boolean>> {
    const res = await apiClient.patch<ApiResponse<boolean>>(
      `${this.notifPath}/${id}/read`,
    );
    return res.data;
  }

  async markAllNotificationsRead(
    userId: number,
  ): Promise<ApiResponse<boolean>> {
    const res = await apiClient.post<ApiResponse<boolean>>(
      `${this.notifPath}/user/${userId}/read-all`,
    );
    return res.data;
  }

  async deleteNotification(id: number): Promise<ApiResponse<boolean>> {
    const res = await apiClient.delete<ApiResponse<boolean>>(
      `${this.notifPath}/${id}`,
    );
    return res.data;
  }

  // ----- Notification Templates -----
  private templatePath = "/api/v1/notification-templates";

  async getTemplates(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<ApiResponse<PaginatedResult<NotificationTemplateResponseDto>>> {
    const res = await apiClient.get<
      ApiResponse<PaginatedResult<NotificationTemplateResponseDto>>
    >(this.templatePath, { params });
    return res.data;
  }

  async getTemplate(
    id: number,
  ): Promise<ApiResponse<NotificationTemplateResponseDto>> {
    const res = await apiClient.get<
      ApiResponse<NotificationTemplateResponseDto>
    >(`${this.templatePath}/${id}`);
    return res.data;
  }

  async createTemplate(
    data: CreateNotificationTemplateDto,
  ): Promise<ApiResponse<NotificationTemplateResponseDto>> {
    const res = await apiClient.post<
      ApiResponse<NotificationTemplateResponseDto>
    >(this.templatePath, data);
    return res.data;
  }

  async updateTemplate(
    id: number,
    data: UpdateNotificationTemplateDto,
  ): Promise<ApiResponse<NotificationTemplateResponseDto>> {
    const res = await apiClient.put<
      ApiResponse<NotificationTemplateResponseDto>
    >(`${this.templatePath}/${id}`, data);
    return res.data;
  }

  async deleteTemplate(id: number): Promise<ApiResponse<boolean>> {
    const res = await apiClient.delete<ApiResponse<boolean>>(
      `${this.templatePath}/${id}`,
    );
    return res.data;
  }

  // ----- Notify Logs (delivery logs) -----
  private logPath = "/api/v1/notify-logs";

  async getLogs(params?: {
    page?: number;
    pageSize?: number;
    recipientEmail?: string;
    status?: string;
    channel?: string;
  }): Promise<ApiResponse<PaginatedResult<NotifyLogResponseDto>>> {
    const res = await apiClient.get<
      ApiResponse<PaginatedResult<NotifyLogResponseDto>>
    >(this.logPath, { params });
    return res.data;
  }

  async getLog(id: number): Promise<ApiResponse<NotifyLogResponseDto>> {
    const res = await apiClient.get<ApiResponse<NotifyLogResponseDto>>(
      `${this.logPath}/${id}`,
    );
    return res.data;
  }

  async deleteLog(id: number): Promise<ApiResponse<boolean>> {
    const res = await apiClient.delete<ApiResponse<boolean>>(
      `${this.logPath}/${id}`,
    );
    return res.data;
  }

  async retryLog(id: number): Promise<ApiResponse<boolean>> {
    const res = await apiClient.post<ApiResponse<boolean>>(
      `${this.logPath}/${id}/retry`,
    );
    return res.data;
  }
}
const notificationApi = new NotificationAPI();
export default notificationApi;
