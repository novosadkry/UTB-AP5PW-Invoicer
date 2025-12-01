export interface Payment {
  id: number;
  invoiceId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
}

export interface CreatePaymentDto {
  invoiceId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
}

export interface UpdatePaymentDto extends CreatePaymentDto {
  id: number;
}
