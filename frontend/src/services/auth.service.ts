import { clientApi } from '../lib/clientApi';
import {
  AuthSuccessData,
  LoginRequest,
  SignupRequest,
  User,
} from '../types/auth.types';

export class AuthService {
  async signup(data: SignupRequest): Promise<AuthSuccessData> {
    return clientApi.post<AuthSuccessData>('/api/auth/signup', data);
  }

  async login(data: LoginRequest): Promise<AuthSuccessData> {
    return clientApi.post<AuthSuccessData>('/api/auth/login', data);
  }

  async getProfile(): Promise<{ user: User }> {
    return clientApi.get<{ user: User }>('/api/auth/me');
  }

  async logout(): Promise<{ message: string }> {
    return clientApi.post<{ message: string }>('/api/auth/logout');
  }
}

export const authService = new AuthService();
