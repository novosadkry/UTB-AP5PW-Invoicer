using UTB_AP5PW_Invoicer.Domain.Entities;

namespace UTB_AP5PW_Invoicer.Application.DTOs
{
    public record DashboardSummaryDto
    {
        public decimal TotalAmount { get; set; }
        public int OverdueInvoices { get; set; }
        public int UnpaidInvoices { get; set; }
        public int TotalInvoices { get; set; }
        public ICollection<InvoiceSummaryDto> LatestInvoices { get; set; } = new List<InvoiceSummaryDto>();
        public ICollection<PaymentSummaryDto> LatestPayments { get; set; } = new List<PaymentSummaryDto>();
    }

    public record InvoiceSummaryDto
    {
        public decimal TotalAmount { get; set; }
        public InvoiceStatus Status { get; set; }
        public DateTimeOffset DueDate { get; set; }
        public DateTimeOffset IssueDate { get; set; }
        public string? CustomerName { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public int Id { get; set; }
    }

    public record PaymentSummaryDto
    {
        public int Id { get; set; }
        public int InvoiceId { get; set; }
        public string InvoiceNumber { get; set; } = string.Empty;
        public string? CustomerName { get; set; }
        public DateTimeOffset PaymentDate { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
    }
}
