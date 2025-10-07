export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export type LoadingState = "idle" | "loading" | "success" | "error";