export interface UserDto {
  id: number;
  email: string;
  fullName: string;
  role: "user" | "admin";
  companyName?: string;
  ico?: string;
  dic?: string;
  companyAddress?: string;
  companyPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserDto {
  email: string;
  fullName: string;
  companyName?: string;
  ico?: string;
  dic?: string;
  companyAddress?: string;
  companyPhone?: string;
}
