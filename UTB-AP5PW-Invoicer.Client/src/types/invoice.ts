export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface Invoice {
  id: number;
  customerId: number | null;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  totalAmount: number;
  totalVat: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceDto {
  customerId: number | null;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
}

export interface UpdateInvoiceDto extends CreateInvoiceDto {
  id: number;
}
