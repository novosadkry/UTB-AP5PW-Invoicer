export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  role: string;
  companyName?: string;
  ico?: string;
  dic?: string;
  companyAddress?: string;
  companyPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDto {
  email: string;
  fullName: string;
  companyName?: string;
  ico?: string;
  dic?: string;
  companyAddress?: string;
  companyPhone?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
