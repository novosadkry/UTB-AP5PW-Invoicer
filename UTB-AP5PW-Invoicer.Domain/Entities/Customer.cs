using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UTB_AP5PW_Invoicer.Domain.Entities
{
    public class Customer : Entity<int>
    {
        [ForeignKey(nameof(User))]
        public int UserId { get; set; }

        [Required]
        public string Name { get; set; }

        public string? Ico { get; set; }

        public string? Dic { get; set; }

        [Required]
        public string Address { get; set; }

        [Required, EmailAddress]
        public string ContactEmail { get; set; }

        [Required]
        public string ContactPhone { get; set; }

        public User User { get; set; }
        public ICollection<Invoice> Invoices { get; set; }
    }
}
