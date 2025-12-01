using MediatR;

namespace UTB_AP5PW_Invoicer.Application.Features.RefreshTokens.Commands.Create
{
    public record CreateRefreshTokenCommand : IRequest<Guid>
    {
        public int UserId { get; set; }
        public string Token { get; set; }
        public DateTimeOffset ExpiresAt { get; set; }
    }
}
