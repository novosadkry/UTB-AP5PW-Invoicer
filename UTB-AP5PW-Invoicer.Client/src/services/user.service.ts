import type { AxiosInstance } from 'axios';
import type { UpdateUserDto, UserDto } from '@/types/user';

export class UserService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getProfile(): Promise<UserDto> {
    const response = await this.api.get<UserDto>('/users/profile');
    return response.data;
  }

  async updateProfile(profile: UpdateUserDto): Promise<void> {
    await this.api.put('/users/profile', profile);
  }
}
