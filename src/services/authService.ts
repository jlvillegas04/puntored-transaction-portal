import { apiClient } from "@/api/client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { AuthResponse, LoginCredentials, AuthTokenData } from "@/types";

interface RawAuthResponse {
  state: boolean;
  message: string;
  code: string;
  data: AuthTokenData;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const rawResponse = await apiClient.post<RawAuthResponse>(API_ENDPOINTS.AUTH, credentials);
    return {
      success: rawResponse.state,
      data: rawResponse.data,
      message: rawResponse.message,
      code: rawResponse.code,
    };
  }

  validateToken(token: string): boolean {
    // Basic validation - check if token exists
    return !!token && token.length > 0;
  }

  isTokenExpired(expiration: string): boolean {
    const expirationDate = new Date(expiration);
    const now = new Date();
    return expirationDate < now;
  }
}

export const authService = new AuthService();