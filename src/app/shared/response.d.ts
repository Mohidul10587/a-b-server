// types/response.ts
export interface ApiResponse<T> {
  success: boolean;
  successMessage?: string;
  errorMessage?: string;
  data?: T;
  token?: string;
}
