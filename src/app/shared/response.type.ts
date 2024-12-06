// ApiResponse.ts
export default interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  token?: string;
}
