import type { AxiosInstance } from 'axios';
import type { LoginResponse } from "@/hooks/use-auth.tsx";
import type { ChangePasswordDto, LoginDto, SignupDto } from '@/types/auth';

export class AuthService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async login(data: LoginDto): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>(
      '/auth/login',
      { ...data }
    );

    return response.data;
  }

  async signup(data: SignupDto): Promise<LoginResponse> {
    const response = await this.api.post<LoginResponse>(
      '/auth/signup',
      { ...data }
    );

    return response.data;
  }

  async changePassword(data: ChangePasswordDto): Promise<void> {
    await this.api.post('/auth/change-password', data);
  }
}
