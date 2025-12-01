using MediatR;

namespace UTB_AP5PW_Invoicer.Application.Features.Invoices.Commands.Create
{
    public record CreateInvoiceCommand : IRequest<int>
    {
        public int UserId { get; set; }
        public int? CustomerId { get; set; }
        public string InvoiceNumber { get; set; }
        public DateTimeOffset IssueDate { get; set; }
        public DateTimeOffset DueDate { get; set; }
        public string Status { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}
