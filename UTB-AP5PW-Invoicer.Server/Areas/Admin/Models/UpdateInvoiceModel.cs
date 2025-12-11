using UTB_AP5PW_Invoicer.Domain.Entities;

namespace UTB_AP5PW_Invoicer.Server.Areas.Admin.Models
{
    public class UpdateInvoiceModel
    {
        public int? CustomerId { get; set; }
        public string InvoiceNumber { get; set; }
        public DateTimeOffset IssueDate { get; set; }
        public DateTimeOffset DueDate { get; set; }
        public InvoiceStatus Status { get; set; }
        public decimal TotalAmount { get; set; }
    }
}
