import { serverApi } from '../lib/serverApi';
import {
  AuthSuccessData,
  LoginRequest,
  SignupRequest,
  User,
} from '../types/auth.types';

export class AuthApiService {
  async signup(data: SignupRequest): Promise<AuthSuccessData> {
    return serverApi.post<AuthSuccessData>('/auth/signup', data);
  }

  async login(data: LoginRequest): Promise<AuthSuccessData> {
    return serverApi.post<AuthSuccessData>('/auth/login', data);
  }

  async getProfile(token: string): Promise<{ user: User }> {
    return serverApi.get<{ user: User }>('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const authApiService = new AuthApiService();
