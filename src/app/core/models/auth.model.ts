export interface LogingResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    active: boolean | number;
    email: string;
    full_name: string;
    role: string;
  };
}

export interface LoginRequest {
  email?: string | null;
  password?: string | null;
}