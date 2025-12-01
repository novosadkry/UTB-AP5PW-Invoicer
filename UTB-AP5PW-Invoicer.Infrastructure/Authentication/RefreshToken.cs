using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Domain.Entities;

namespace UTB_AP5PW_Invoicer.Infrastructure.Authentication
{
    [Index(nameof(Token), IsUnique = true)]
    public class RefreshToken
    {
        [Key]
        public Guid RefreshTokenId { get; set; }

        [ForeignKey(nameof(User))]
        public int UserId { get; set; }

        [Required]
        public string Token { get; set; }

        public DateTimeOffset ExpiresAt { get; set; }

        public bool Revoked { get; set; }

        public User User { get; set; }
    }
}
