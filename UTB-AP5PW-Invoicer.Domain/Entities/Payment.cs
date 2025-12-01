using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UTB_AP5PW_Invoicer.Domain.Entities
{
    public class Payment : Entity<int>
    {
        [ForeignKey(nameof(Invoice))]
        public int InvoiceId { get; set; }

        [Required]
        public DateTimeOffset PaymentDate { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public string PaymentMethod { get; set; }

        public Invoice Invoice { get; set; }
    }
}
