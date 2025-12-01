export interface Report {
  periodStart: string;
  periodEnd: string;
  totalRevenue: number;
  totalVat: number;
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
  overdueInvoices: number;
  paidAmount: number;
  unpaidAmount: number;
  revenueByCustomer: CustomerRevenue[];
  monthlyRevenue: MonthlyRevenue[];
}

export interface CustomerRevenue {
  customerId: number;
  customerName: string;
  revenue: number;
  invoiceCount: number;
}

export interface MonthlyRevenue {
  year: number;
  month: number;
  revenue: number;
  invoiceCount: number;
}
