export interface UserResponse {
  id: number;   
  fullName: string;
  email: string;
  password: string;
  role: string;
  active: boolean | number;
}