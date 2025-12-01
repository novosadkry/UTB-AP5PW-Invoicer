using MediatR;

namespace UTB_AP5PW_Invoicer.Application.Features.RefreshTokens.Commands.Revoke
{
    public record RevokeRefreshTokenCommand(Guid Id) : IRequest<bool>;
}
