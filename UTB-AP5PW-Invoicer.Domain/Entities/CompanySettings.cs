using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UTB_AP5PW_Invoicer.Domain.Entities
{
    public class CompanySettings
    {
        [Key, ForeignKey(nameof(Company))]
        public int CompanyId { get; set; }

        [Required]
        public string InvoiceNumberFormat { get; set; }

        [Required]
        public string InvoiceTemplate { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public Company Company { get; set; }
    }
}
