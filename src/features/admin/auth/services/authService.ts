// src/features/auth/services/authService.ts
import axiosInstance from '@/services/axios';
import type { LoginFormValues } from '../validators/loginSchema';

export const login = async (data: LoginFormValues) => {
  const res = await axiosInstance.post('/auth/login', data);
  return res.data.data; // { user, token }
};

export const getMe = async () => {
  const res = await axiosInstance.get('/users/me');
  return res.data.data;
};

export const logout = () => {
  return axiosInstance.post('/auth/logout');
};