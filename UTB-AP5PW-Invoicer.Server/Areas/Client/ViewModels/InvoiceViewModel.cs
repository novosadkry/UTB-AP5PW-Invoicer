using UTB_AP5PW_Invoicer.Domain.Entities;

namespace UTB_AP5PW_Invoicer.Server.Areas.Client.ViewModels
{
    public class InvoiceViewModel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int? CustomerId { get; set; }
        public string InvoiceNumber { get; set; }
        public DateTimeOffset IssueDate { get; set; }
        public DateTimeOffset DueDate { get; set; }
        public InvoiceStatus Status { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}
