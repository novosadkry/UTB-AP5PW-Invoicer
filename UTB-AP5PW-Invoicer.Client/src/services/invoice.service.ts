import type { AxiosInstance } from 'axios';
import type {
  Invoice,
  InvoicePdf,
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

  async downloadPdf(id: number): Promise<InvoicePdf> {
    const response = await this.api.get(`/invoices/${id}/pdf`, {
      responseType: 'blob'
    });
    const match = response.headers['content-disposition'].match(/filename=([^"]+);/);

    return {
      filename: match ? match[1] : `invoice_${id}.pdf`,
      data: response.data
    }
  }

  async generateShareLink(id: number): Promise<{ shareToken: string }> {
    const response = await this.api.post<{ shareToken: string }>(`/invoices/${id}/share`);
    return response.data;
  }

  async getSharedInvoice(token: string): Promise<Invoice> {
    const response = await this.api.get<Invoice>(`/invoices/shared/${token}`);
    return response.data;
  }

  async downloadSharedPdf(token: string): Promise<Blob> {
    const response = await this.api.get(`/invoices/shared/${token}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  }
}
