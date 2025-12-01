using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UTB_AP5PW_Invoicer.Domain.Entities
{
    public class Invoice : Entity<int>
    {
        [ForeignKey(nameof(User))]
        public int UserId { get; set; }

        [ForeignKey(nameof(Customer))]
        public int? CustomerId { get; set; }

        [Required]
        public string InvoiceNumber { get; set; }

        [Required]
        public DateTimeOffset IssueDate { get; set; }

        [Required]
        public DateTimeOffset DueDate { get; set; }

        [Required]
        public InvoiceStatus Status { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }

        public string? ShareToken { get; set; }

        public User User { get; set; }
        public Customer? Customer { get; set; }
        public ICollection<Payment> Payments { get; set; }
        public ICollection<InvoiceItem> InvoiceItems { get; set; }
    }
}
