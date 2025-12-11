namespace UTB_AP5PW_Invoicer.Server.Areas.Client.ViewModels
{
    public class ReportViewModel
    {
        public DateTimeOffset PeriodStart { get; set; }
        public DateTimeOffset PeriodEnd { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TotalInvoices { get; set; }
        public int PaidInvoices { get; set; }
        public int UnpaidInvoices { get; set; }
        public int OverdueInvoices { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal UnpaidAmount { get; set; }
        public ICollection<CustomerRevenueViewModel> RevenueByCustomer { get; set; } = new List<CustomerRevenueViewModel>();
        public ICollection<MonthlyRevenueViewModel> MonthlyRevenue { get; set; } = new List<MonthlyRevenueViewModel>();
    }

    public class CustomerRevenueViewModel
    {
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public decimal Revenue { get; set; }
        public int InvoiceCount { get; set; }
    }

    public class MonthlyRevenueViewModel
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal Revenue { get; set; }
        public int InvoiceCount { get; set; }
    }
}
