export interface Invoice {
  id: number;
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
  id: number;
}

export interface InvoiceSummary {
  id: number;
  invoiceNumber: string;
  customerName: string | null;
  issueDate: string;
  dueDate: string;
  status: string;
  totalAmount: number;
}

export interface InvoiceDashboardSummary {
  totalInvoices: number;
  unpaidInvoices: number;
  overdueInvoices: number;
  totalAmount: number;
  latestInvoices: InvoiceSummary[];
}
