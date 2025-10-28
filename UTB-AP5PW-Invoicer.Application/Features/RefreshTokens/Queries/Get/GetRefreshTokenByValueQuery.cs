using MediatR;
using UTB_AP5PW_Invoicer.Application.DTOs;

namespace UTB_AP5PW_Invoicer.Application.Features.RefreshTokens.Queries.Get
{
    public record GetRefreshTokenByValueQuery(string Token) : IRequest<RefreshTokenDto?>;
}
