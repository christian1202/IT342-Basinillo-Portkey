// Shared API types for the PortKey web frontend — vertical slice architecture

export interface ApiError {
  code: string;
  message: string;
  details: Record<string, string> | string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  timestamp: string;
}
