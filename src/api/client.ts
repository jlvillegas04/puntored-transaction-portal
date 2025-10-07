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
            console.error("[API Client] Failed to parse auth storage:", error);
          }
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
      
        if (error.response?.status === 403) {
         
          // Only logout for auth-related endpoints, not for find-suppliers
          // The find-suppliers endpoint may temporarily reject valid tokens (backend issue)
          const url = error.config?.url || '';
          const isAuthEndpoint = url.includes('/auth') || url.includes('/login');
          const isSuppliersEndpoint = url.includes('/find-suppliers');
          
          if (isAuthEndpoint) {
            useAuthStore.getState().logout('Su sesión ha expirado por razones de seguridad. Por favor, inicie sesión nuevamente.');
          } else if (isSuppliersEndpoint) {
            // Don't logout - let the hook handle this gracefully with cached data
          } else {
            console.warn('[API Client] Non-auth endpoint failed with 403 - may be temporary server issue');
          }
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
          "Ocurrió un error. Por favor, inténtalo de nuevo más tarde.",
        code: (error.response.data as any)?.code,
        details: error.response.data as Record<string, unknown>,
      };
    } else if (error.request) {
      return {
        status: 0,
        message: "Network error. Please check your internet connection.",
      };
    } else {
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