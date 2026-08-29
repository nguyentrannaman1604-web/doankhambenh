export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role:
    | "PATIENT"
    | "DOCTOR"
    | "ADMIN"
    | "RECEPTIONIST";
}

export interface LoginData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginData;
}