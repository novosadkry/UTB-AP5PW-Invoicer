namespace UTB_AP5PW_Invoicer.Application.DTOs
{
    public class RefreshTokenDto
    {
        public Guid RefreshTokenId { get; set; }
        public int UserId { get; set; }
        public string Token { get; set; }
        public DateTime ExpiresAt { get; set; }
        public bool Revoked { get; set; }
    }
}
