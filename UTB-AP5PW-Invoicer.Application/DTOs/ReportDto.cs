namespace UTB_AP5PW_Invoicer.Application.DTOs
{
    public record ReportDto
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
        public ICollection<CustomerRevenueDto> RevenueByCustomer { get; set; } = new List<CustomerRevenueDto>();
        public ICollection<MonthlyRevenueDto> MonthlyRevenue { get; set; } = new List<MonthlyRevenueDto>();
    }

    public record CustomerRevenueDto
    {
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public decimal Revenue { get; set; }
        public int InvoiceCount { get; set; }
    }

    public record MonthlyRevenueDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public decimal Revenue { get; set; }
        public int InvoiceCount { get; set; }
    }
}
