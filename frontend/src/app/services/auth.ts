import { api } from "./api";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  avatar?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>("/auth/login", { email, password }),

  register: (data: { name: string; email: string; password: string; role?: string; department?: string }) =>
    api.post<LoginResponse>("/auth/register", data),

  getProfile: () => api.get<{ user: AuthUser }>("/auth/me"),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post("/auth/change-password", { currentPassword, newPassword }),
};
