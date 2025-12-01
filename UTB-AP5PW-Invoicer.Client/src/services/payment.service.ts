import type { AxiosInstance } from 'axios';
import type { Payment, CreatePaymentDto } from '@/types/payment';

export class PaymentService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getByInvoice(invoiceId: number): Promise<Payment[]> {
    const response = await this.api.get<Payment[]>(`/payments/invoice/${invoiceId}`);
    return response.data;
  }

  async create(payment: CreatePaymentDto): Promise<{ id: number }> {
    const response = await this.api.post<{ id: number }>('/payments', payment);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await this.api.delete(`/payments/${id}`);
  }
}
