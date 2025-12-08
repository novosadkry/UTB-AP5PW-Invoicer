using UTB_AP5PW_Invoicer.Domain.Entities;

namespace UTB_AP5PW_Invoicer.Application.DTOs
{
    public record UserDto
    {
        public int Id { get; set; }
        public UserRole Role { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string? PasswordResetToken { get; set; }
        public DateTimeOffset? PasswordResetExpiry { get; set; }
        public string FullName { get; set; }
        public string? CompanyName { get; set; }
        public string? Ico { get; set; }
        public string? Dic { get; set; }
        public string? CompanyAddress { get; set; }
        public string? CompanyPhone { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}
