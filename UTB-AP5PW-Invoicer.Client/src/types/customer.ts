export interface Customer {
  id: number;
  userId: number;
  name: string;
  ico?: string | null;
  dic?: string | null;
  address: string;
  contactEmail: string;
  contactPhone: string;
}

export interface CreateCustomerDto {
  name: string;
  ico?: string | null;
  dic?: string | null;
  address: string;
  contactEmail: string;
  contactPhone: string;
}

export interface UpdateCustomerDto extends CreateCustomerDto {
  id: number;
}
