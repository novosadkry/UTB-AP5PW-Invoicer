using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UTB_AP5PW_Invoicer.Domain.Entities
{
    public class Invoice
    {
        [Key]
        public int InvoiceId { get; set; }

        [ForeignKey(nameof(Company))]
        public int CompanyId { get; set; }

        [ForeignKey(nameof(Customer))]
        public int CustomerId { get; set; }

        [Required]
        public string InvoiceNumber { get; set; }

        [Required]
        public DateTime IssueDate { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        [Required]
        public string Status { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }

        [Required]
        public decimal TotalVat { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public Company Company { get; set; }
        public Customer Customer { get; set; }
        public ICollection<InvoiceItem> InvoiceItems { get; set; }
        public ICollection<Payment> Payments { get; set; }
    }
}
