import type { InvoiceStatus } from './invoice';

export interface DashboardSummary {
  totalInvoices: number;
  unpaidInvoices: number;
  overdueInvoices: number;
  totalAmount: number;
  latestInvoices: InvoiceSummary[];
  latestPayments: PaymentSummary[];
}

export interface InvoiceSummary {
  id: number;
  invoiceNumber: string;
  customerName: string | null;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  totalAmount: number;
}

export interface PaymentSummary {
  id: number;
  invoiceId: number;
  invoiceNumber: string;
  customerName: string | null;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
}
