export interface LoginResponse {
  success: boolean;
  message?: string;
  data: {
    token: string;
    active: boolean | number;
    email: string;
    role: string;
  };
}

export interface LoginRequest {
  email?: string | null;
  password?: string | null;
}