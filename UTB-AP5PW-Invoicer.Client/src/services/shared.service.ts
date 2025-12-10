import type { AxiosInstance } from 'axios';
import type { Invoice } from '@/types/invoice';
import type { InvoiceItem } from '@/types/invoice-item';
import type { Payment } from '@/types/payment';
import type { Customer } from '@/types/customer';

export class SharedService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getSharedInvoice(token: string): Promise<Invoice> {
    const response = await this.api.get<Invoice>(`/invoices/shared/${token}`);
    return response.data;
  }

  async getSharedInvoiceItems(token: string): Promise<InvoiceItem[]> {
    const response = await this.api.get<InvoiceItem[]>(`/invoices/shared/${token}/items`);
    return response.data;
  }

  async getSharedPayments(token: string): Promise<Payment[]> {
    const response = await this.api.get<Payment[]>(`/invoices/shared/${token}/payments`);
    return response.data;
  }

  async getSharedCustomer(token: string): Promise<Customer> {
    const response = await this.api.get<Customer>(`/invoices/shared/${token}/customer`);
    return response.data;
  }

  async downloadSharedPdf(token: string): Promise<Blob> {
    const response = await this.api.get(`/invoices/shared/${token}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  }
}
