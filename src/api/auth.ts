import { api } from '../utils/request';
import type { LoginResponse } from './types';

export const authApi = {
  login: (data: any) => api.post<LoginResponse>('/login', data),
  register: (data: any) => api.post('/register', data),
};
