export interface User {
  id: number;   
  full_name: string;
  email: string;
  password: string;
  role: string;
  active: boolean | number;
}