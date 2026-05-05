// src/stores/authStore.ts

import type { AuthResponseDto } from "../api/core/auth";
import authApi from "../api/core/auth";
import { showConfirm } from "../utils/dialogs";
import { showApiError, showError } from "../utils/notification";

// ---------- Types ----------
export interface UserData {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  roles: string[];
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface AuthData {
  user: UserData;
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds until access token expires
}

export interface AuthState {
  user: UserData | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

type AuthChangeCallback = (isAuthenticated: boolean) => void;

// ---------- Helper: Convert backend AuthResponseDto to UserData ----------
const mapToUserData = (dto: AuthResponseDto): UserData => ({
  id: dto.userId,
  username: dto.username,
  email: dto.email,
  fullName: dto.fullName,
  roles: dto.roles,
  isActive: true, // not returned by auth endpoint, assume true; could be fetched separately
  createdAt: new Date().toISOString(), // placeholder
});

// ---------- AuthStore Class ----------
export class AuthStore {
  private readonly APP_NAME = "AESTHETIC_CLINIC";
  private readonly ACCESS_TOKEN_KEY = `${this.APP_NAME}_access_token`;
  private readonly REFRESH_TOKEN_KEY = `${this.APP_NAME}_refresh_token`;
  private readonly USER_DATA_KEY = `${this.APP_NAME}_user_data`;
  private readonly TOKEN_EXPIRATION_KEY = `${this.APP_NAME}_token_expiration`;
  private notifying = false;

  // --- Core auth methods -------------------------------------------------
  async login(usernameOrEmail: string, password: string): Promise<boolean> {
    try {
      console.log(usernameOrEmail,password)
      const res = await authApi.login({ usernameOrEmail, password });
   
      if (!res.success || !res.data) {
        showError(res.message || "Login failed");
        return false;
      }

      const dto = res.data;
      const user = mapToUserData(dto);
      const expirationTime = Date.now() + 60 * 60 * 1000; // default 1 hour
      localStorage.setItem(this.ACCESS_TOKEN_KEY, dto.token);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, dto.refreshToken);
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
      localStorage.setItem(this.TOKEN_EXPIRATION_KEY, expirationTime.toString());

      this.notifyAuthChange();
      console.log(`Logged in as ${user.username} (${user.roles.join(", ")})`);
      return true;
    } catch (err: any) {
      showApiError(err);
      return false;
    }
  }

  async register(
    username: string,
    email: string,
    password: string,
    fullName?: string
  ): Promise<boolean> {
    try {
      const res = await authApi.register({ username, email, password, fullName });
      if (!res.success || !res.data) {
        showError(res.message || "Registration failed");
        return false;
      }
      // After registration, automatically log in
      return await this.login(username, password);
    } catch (err: any) {
      showApiError(err);
      return false;
    }
  }

  async logout(): Promise<boolean> {
    const confirmed = await showConfirm({
      title: "Log out?",
      message: "Are you sure you want to log out?",
      icon: "warning",
      confirmText: "Yes, logout",
      cancelText: "Cancel",
    });
    if (!confirmed) return false;

    try {
      // Call backend logout to revoke refresh token (optional, but good practice)
      await authApi.logout();
    } catch (err) {
      // ignore errors – just proceed with local cleanup
      console.warn("Backend logout failed", err);
    } finally {
      this.clearAuth();
      window.location.hash = "/login";
    }
    return true;
  }

  async refreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearAuth();
      return null;
    }

    try {
      const res = await authApi.refreshToken({ refreshToken });
      if (!res.success || !res.data) {
        throw new Error(res.message || "Refresh failed");
      }
      const dto = res.data;
      const expirationTime = Date.now() + 60 * 60 * 1000; // assume 1 hour
      localStorage.setItem(this.ACCESS_TOKEN_KEY, dto.token);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, dto.refreshToken);
      localStorage.setItem(this.TOKEN_EXPIRATION_KEY, expirationTime.toString());

      this.notifyAuthChange();
      return dto.token;
    } catch (err: any) {
      console.error("Token refresh error:", err);
      this.clearAuth();
      window.location.hash = "/login";
      return null;
    }
  }

  // --- Getters ----------------------------------------------------------
  getAccessToken(): string | null {
    if (this.isTokenExpired()) {
      console.debug("Access token expired");
      return null;
    }
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getUser(): UserData | null {
    const raw = localStorage.getItem(this.USER_DATA_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UserData;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const user = this.getUser();
    return !!token && !!user && !this.isTokenExpired();
  }

  isTokenExpired(): boolean {
    const exp = localStorage.getItem(this.TOKEN_EXPIRATION_KEY);
    if (!exp) return true;
    return Date.now() >= parseInt(exp, 10);
  }

  // --- Role checks -------------------------------------------------------
  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.roles?.includes(role) ?? false;
  }

  isAdmin(): boolean {
    return this.hasRole("Admin");
  }

  isStaff(): boolean {
    return this.hasRole("Staff");
  }

  isClient(): boolean {
    return this.hasRole("Client");
  }

  // --- State management -------------------------------------------------
  clearAuth(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRATION_KEY);
    this.notifyAuthChange();
  }

  getState(): AuthState {
    return {
      user: this.getUser(),
      accessToken: this.getAccessToken(),
      refreshToken: this.getRefreshToken(),
      isAuthenticated: this.isAuthenticated(),
    };
  }

  // --- Event broadcasting ------------------------------------------------
  private notifyAuthChange(): void {
    if (this.notifying) return;
    this.notifying = true;
    const event = new CustomEvent("authStateChanged", {
      detail: { authenticated: this.isAuthenticated() },
    });
    document.dispatchEvent(event);
    this.notifying = false;
  }

  // --- Cross‑tab synchronization via storage events ---------------------
  subscribe(callback: AuthChangeCallback): void {
    window.addEventListener("storage", (e: StorageEvent) => {
      if (
        e.key === this.ACCESS_TOKEN_KEY ||
        e.key === this.USER_DATA_KEY ||
        e.key === this.TOKEN_EXPIRATION_KEY
      ) {
        callback(this.isAuthenticated());
      }
    });
  }

  // --- Utility for API auto-refresh (can be used in axios interceptor) --
  async ensureValidToken(): Promise<string | null> {
    if (!this.isTokenExpired()) {
      return this.getAccessToken();
    }
    // Try to refresh if we have a refresh token
    const refresh = this.getRefreshToken();
    if (refresh) {
      return await this.refreshToken();
    }
    this.clearAuth();
    return null;
  }
}

// Singleton instance
export const authStore = new AuthStore();