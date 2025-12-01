import type { AxiosInstance } from 'axios';
import type { UserProfile, UpdateProfileDto, ChangePasswordDto } from '@/types/user';

export class UserService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getProfile(): Promise<UserProfile> {
    const response = await this.api.get<UserProfile>('/users/profile');
    return response.data;
  }

  async updateProfile(profile: UpdateProfileDto): Promise<void> {
    await this.api.put('/users/profile', profile);
  }

  async changePassword(data: ChangePasswordDto): Promise<void> {
    await this.api.post('/auth/change-password', data);
  }
}
