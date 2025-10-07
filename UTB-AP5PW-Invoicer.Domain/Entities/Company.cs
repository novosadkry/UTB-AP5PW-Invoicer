using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UTB_AP5PW_Invoicer.Domain.Entities
{
    public class Company
    {
        [Key]
        public int CompanyId { get; set; }

        [ForeignKey(nameof(User))]
        public int UserId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Ico { get; set; }  // IČ

        [Required]
        public string Dic { get; set; }  // DIČ

        [Required]
        public string Address { get; set; }

        [Required, EmailAddress]
        public string ContactEmail { get; set; }

        [Required]
        public string ContactPhone { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public User User { get; set; }
        public ICollection<Customer> Customers { get; set; }
        public ICollection<Invoice> Invoices { get; set; }
        public CompanySettings CompanySettings { get; set; }
    }
}
