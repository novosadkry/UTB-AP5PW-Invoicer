using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace UTB_AP5PW_Invoicer.Domain.Entities
{
    public class User : Entity<int>
    {
        [Required]
        [DefaultValue(UserRole.User)]
        public UserRole Role { get; set; }

        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }
        public string? PasswordResetToken { get; set; }
        public DateTimeOffset? PasswordResetExpiry { get; set; }

        [Required]
        public string FullName { get; set; }

        public string? CompanyName { get; set; }
        public string? Ico { get; set; }
        public string? Dic { get; set; }
        public string? CompanyAddress { get; set; }
        public string? CompanyPhone { get; set; }
    }
}
