import type { AxiosInstance } from 'axios';
import type {
  Invoice,
  CreateInvoiceDto,
  UpdateInvoiceDto,
} from '@/types/invoice';

export class InvoiceService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getAll(): Promise<Invoice[]> {
    const response = await this.api.get<Invoice[]>('/invoices');
    return response.data;
  }

  async getById(id: number): Promise<Invoice> {
    const response = await this.api.get<Invoice>(`/invoices/${id}`);
    return response.data;
  }

  async create(invoice: CreateInvoiceDto): Promise<Invoice> {
    const response = await this.api.post<Invoice>('/invoices', invoice);
    return response.data;
  }

  async update(invoice: UpdateInvoiceDto): Promise<void> {
    await this.api.put(`/invoices/${invoice.id}`, invoice);
  }

  async delete(id: number): Promise<void> {
    await this.api.delete(`/invoices/${id}`);
  }
}
