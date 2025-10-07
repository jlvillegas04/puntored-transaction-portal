import { ApiResponse } from "./common.types";

export interface LoginCredentials {
  username: string;
  password: string;
  commerce: number;
}

export interface AuthTokenData {
  token: string;
  type: string;
  expiration: string;
}

export interface AuthResponse extends ApiResponse<AuthTokenData> {
  success: boolean;
  data: AuthTokenData;
  message?: string;
}

export interface AuthState {
  token: string | null;
  type: string | null;
  expiration: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: (reason?: string) => void;
  checkExpiration: () => boolean;
  isTokenValid: () => boolean;
}