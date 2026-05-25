export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  isAdmin?: boolean;
}