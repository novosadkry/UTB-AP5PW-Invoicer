namespace UTB_AP5PW_Invoicer.Application.DTOs
{
    public record DashboardSummaryDto
    {
        public decimal TotalAmount { get; set; }
        public int OverdueInvoices { get; set; }
        public int UnpaidInvoices { get; set; }
        public int TotalInvoices { get; set; }
        public ICollection<InvoiceSummaryDto> LatestInvoices { get; set; } = new List<InvoiceSummaryDto>();
    }

    public record InvoiceSummaryDto
    {
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public DateTime IssueDate { get; set; }
        public string? CustomerName { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public int Id { get; set; }
    }
}
