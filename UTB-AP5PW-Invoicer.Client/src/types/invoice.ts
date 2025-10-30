export interface Invoice {
  invoiceId: number;
  customerId: number | null;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: string;
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
  status: string;
  totalAmount: number;
  totalVat: number;
}

export interface UpdateInvoiceDto extends CreateInvoiceDto {
  invoiceId: number;
}
