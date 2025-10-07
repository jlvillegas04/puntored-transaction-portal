import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { ApiError } from "@/types";
import { useAuthStore } from "@/store/authStore";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor: inject auth token
    this.client.interceptors.request.use(
      (config) => {
        const authStorage = localStorage.getItem("auth-storage");

        if (authStorage) {
          try {
            const { state } = JSON.parse(authStorage);
            const { token, type } = state;

            if (token && type) {
              config.headers.Authorization = `${type} ${token}`;
            }
          } catch (error) {
            console.error("Failed to parse auth storage:", error);
          }
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: normalize errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 403) {
          // Token is invalid, logout user
          useAuthStore.getState().logout('Su sesión ha expirado por razones de seguridad. Por favor, inicie sesión nuevamente.');
        }
        const normalizedError = this.normalizeError(error);
        return Promise.reject(normalizedError);
      }
    );
  }

  private normalizeError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error
      return {
        status: error.response.status,
        message:
          (error.response.data as any)?.message ||
          "An error occurred. Please try again.",
        code: (error.response.data as any)?.code,
        details: error.response.data as Record<string, unknown>,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        status: 0,
        message: "Network error. Please check your internet connection.",
      };
    } else {
      // Error setting up request
      return {
        status: 0,
        message: error.message || "An unexpected error occurred.",
      };
    }
  }

  async post<TResponse, TRequest = unknown>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const response = await this.client.post<TResponse>(url, data, config);
    return response.data;
  }

  async get<TResponse>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const response = await this.client.get<TResponse>(url, config);
    return response.data;
  }

  async put<TResponse, TRequest = unknown>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const response = await this.client.put<TResponse>(url, data, config);
    return response.data;
  }

  async delete<TResponse>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const response = await this.client.delete<TResponse>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();