// src/api/contact_message.ts
import { apiClient } from "@/lib/fetcher";
import { PaginatedResult } from "./types";

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
  ip_address?: string;
}

export interface ContactMessageCreateData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactMessageUpdateData = Partial<ContactMessageCreateData> & { is_read?: boolean };

export interface ContactMessageListParams {
  is_read?: boolean;
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  status: boolean;
  message: string;
  pagination: PaginatedResult;
  results: T[];
}

class ContactMessageAPI {
  private basePath = '/api/v2/portfolio/contact/';

  async list(params?: ContactMessageListParams): Promise<PaginatedResponse<ContactMessage>> {
    try {
      const response = await apiClient.get<PaginatedResponse<ContactMessage>>(this.basePath, { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch contact messages');
    }
  }

  async get(id: number): Promise<ContactMessage> {
    try {
      const response = await apiClient.get<{ status: boolean; message: string; result: ContactMessage }>(
        `${this.basePath}${id}/`
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch contact message');
    }
  }

  async create(data: ContactMessageCreateData): Promise<ContactMessage> {
    try {
      const response = await apiClient.post<{ status: boolean; message: string; result: ContactMessage }>(
        this.basePath,
        data
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to send message');
    }
  }

  async update(id: number, data: ContactMessageUpdateData): Promise<ContactMessage> {
    try {
      const response = await apiClient.put<{ status: boolean; message: string; result: ContactMessage }>(
        `${this.basePath}${id}/`,
        data
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update message');
    }
  }

  async patch(id: number, data: ContactMessageUpdateData): Promise<ContactMessage> {
    try {
      const response = await apiClient.patch<{ status: boolean; message: string; result: ContactMessage }>(
        `${this.basePath}${id}/`,
        data
      );
      return response.data.result;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to patch message');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await apiClient.delete(`${this.basePath}${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete message');
    }
  }
}

const contactMessageAPI = new ContactMessageAPI();
export default contactMessageAPI;