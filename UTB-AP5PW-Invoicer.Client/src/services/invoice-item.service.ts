import type { AxiosInstance } from 'axios';
import type { InvoiceItem } from '@/types/invoice-item';

export interface CreateInvoiceItemDto {
  invoiceId: number;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface UpdateInvoiceItemDto extends CreateInvoiceItemDto {
  id: number;
}

export class InvoiceItemService {
  private api: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.api = api;
  }

  async getByInvoiceId(invoiceId: number): Promise<InvoiceItem[]> {
    const response = await this.api.get<InvoiceItem[]>(`/invoices/${invoiceId}/items`);
    return response.data;
  }

  async create(invoiceId: number, item: CreateInvoiceItemDto): Promise<InvoiceItem> {
    const response = await this.api.post<InvoiceItem>(`/invoices/${invoiceId}/items`, item);
    return response.data;
  }

  async update(invoiceId: number, item: UpdateInvoiceItemDto): Promise<void> {
    await this.api.put(`/invoices/${invoiceId}/items/${item.id}`, item);
  }

  async delete(invoiceId: number, id: number): Promise<void> {
    await this.api.delete(`/invoices/${invoiceId}/items/${id}`);
  }
}
