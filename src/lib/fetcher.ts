
import axios, {
  type AxiosInstance,
  AxiosError,
  type InternalAxiosRequestConfig
} from "axios";
import { global_base_url } from "./global";
import { authStore } from "../stores/authStore";


interface AuthenticatedRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
// Get CSRF token first
async function getCSRFToken(): Promise<string | undefined> {
  // Try to get CSRF token from cookies first
  const cookieToken = getCookie("csrftoken");
  if (cookieToken) return cookieToken;

  // Fallback: fetch from endpoint
  try {
    const response = await fetch(`${global_base_url()}/api/v1/accounts/csrf-token/`, { credentials: "include" });
    if (!response.ok) throw new Error("Failed to fetch CSRF token");
    const data = await response.json();
    return data.csrfToken;
  } catch (e) {
    console.error("Could not get CSRF token:", e);
    return undefined;
  }
}


export const apiClient: AxiosInstance = axios.create({
  baseURL: global_base_url(),
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    // csrfToken: await getCSRFToken(),
  }
});

// REQUEST INTERCEPTOR
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Ensure headers object exists
    config.headers = config.headers || {};

    // Skip auth for login
    if (config.url?.includes("/api/v1/accounts/login")) {
      return config;
    }

    const token = authStore.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR (unchanged)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as AuthenticatedRequest;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await authStore.refreshToken();
        if (newToken) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
        if (!authStore.isAuthenticated()) {
          window.location.hash = "/login";
        }
      } catch (refreshError: any) {
        if (
          axios.isAxiosError(refreshError) &&
          refreshError.response?.status === 401
        ) {
          authStore.clearAuth();
          window.location.hash = "/login";
        } else {
          console.error("Error during token refresh:", refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }
  return undefined;
}

