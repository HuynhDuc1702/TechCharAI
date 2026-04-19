import axiosClient from "./axiosClient";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  name?: string;
};

export type AuthResponse = {
  message: string;
  accessToken?: string;
};

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const res = await axiosClient.post<AuthResponse>("/user/login", payload);
  return res.data;
};

export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const res = await axiosClient.post<AuthResponse>("/user/register", payload);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await axiosClient.get("/user/logout");
};
export const refresh = async (): Promise<AuthResponse> => {
  const res = await axiosClient.get("/user/refresh");
  return res.data;
};

