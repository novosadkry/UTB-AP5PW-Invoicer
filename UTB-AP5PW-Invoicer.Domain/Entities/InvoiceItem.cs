using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UTB_AP5PW_Invoicer.Domain.Entities
{
    public class InvoiceItem
    {
        [Key]
        public int InvoiceItemId { get; set; }

        [ForeignKey(nameof(Invoice))]
        public int InvoiceId { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        public decimal UnitPrice { get; set; }

        [Required]
        public decimal VatRate { get; set; }

        [Required]
        public decimal TotalPrice { get; set; }

        [Required]
        public decimal TotalVat { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public Invoice Invoice { get; set; }
    }
}
