using MediatR;

namespace UTB_AP5PW_Invoicer.Application.Features.RefreshTokens.Commands.Delete
{
    public record DeleteRefreshTokenCommand(Guid Id) : IRequest;
}
