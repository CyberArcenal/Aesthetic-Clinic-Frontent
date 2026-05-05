// src/api/auth.ts
import { apiClient } from "../../lib/fetcher";
import type { ApiResponse } from "./types";

// ---------- DTOs ----------
export interface LoginDto {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthResponseDto {
  userId: number;
  username: string;
  email: string;
  fullName?: string;
  token: string;
  refreshToken: string;
  expiresAt: string;
  roles: string[];
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

// ---------- API methods ----------
class AuthAPI {
  private basePath = "/api/v1/auth";

  // POST /api/v1/auth/register
  async register(data: RegisterDto): Promise<ApiResponse<AuthResponseDto>> {
    const res = await apiClient.post<ApiResponse<AuthResponseDto>>(
      `${this.basePath}/register`,
      data,
    );

    return res.data;
  }

  // POST /api/v1/auth/login
  async login(data: LoginDto): Promise<ApiResponse<AuthResponseDto>> {
    const res = await apiClient.post<ApiResponse<AuthResponseDto>>(
      `${this.basePath}/login`,
      data,
    );
    return res.data;
  }

  // POST /api/v1/auth/refresh
  async refreshToken(
    data: RefreshTokenDto,
  ): Promise<ApiResponse<AuthResponseDto>> {
    const res = await apiClient.post<ApiResponse<AuthResponseDto>>(
      `${this.basePath}/refresh`,
      data,
    );
    return res.data;
  }

  // POST /api/v1/auth/logout
  async logout(): Promise<ApiResponse<boolean>> {
    const res = await apiClient.post<ApiResponse<boolean>>(
      `${this.basePath}/logout`,
    );
    return res.data;
  }

  // GET /api/v1/auth/me
  async getCurrentUser(): Promise<ApiResponse<AuthResponseDto>> {
    const res = await apiClient.get<ApiResponse<AuthResponseDto>>(
      `${this.basePath}/me`,
    );
    return res.data;
  }

  // POST /api/v1/auth/change-password
  async changePassword(data: ChangePasswordDto): Promise<ApiResponse<boolean>> {
    const res = await apiClient.post<ApiResponse<boolean>>(
      `${this.basePath}/change-password`,
      data,
    );
    return res.data;
  }

  // POST /api/v1/auth/forgot-password
  async forgotPassword(data: ForgotPasswordDto): Promise<ApiResponse<boolean>> {
    const res = await apiClient.post<ApiResponse<boolean>>(
      `${this.basePath}/forgot-password`,
      data,
    );
    return res.data;
  }

  // POST /api/v1/auth/reset-password
  async resetPassword(data: ResetPasswordDto): Promise<ApiResponse<boolean>> {
    const res = await apiClient.post<ApiResponse<boolean>>(
      `${this.basePath}/reset-password`,
      data,
    );
    return res.data;
  }
}

const authApi = new AuthAPI();

export default authApi;
