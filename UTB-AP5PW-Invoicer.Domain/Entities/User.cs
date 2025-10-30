using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace UTB_AP5PW_Invoicer.Domain.Entities
{
    public class User : Entity<int>
    {
        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        [DefaultValue(UserRole.User)]
        public UserRole Role { get; set; }

        public string? PasswordResetToken { get; set; }
        public DateTime? PasswordResetExpiry { get; set; }
    }
}
