using System.ComponentModel.DataAnnotations;

namespace UTB_AP5PW_Invoicer.Domain.Entities
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        public string Role { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public string? PasswordResetToken { get; set; }

        public DateTime? PasswordResetExpiry { get; set; }

        public ICollection<Company> Companies { get; set; }
    }
}
