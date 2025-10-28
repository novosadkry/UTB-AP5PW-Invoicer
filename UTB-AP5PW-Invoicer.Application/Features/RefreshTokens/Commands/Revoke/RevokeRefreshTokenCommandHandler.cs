using MediatR;
using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.RefreshTokens.Commands.Revoke
{
    public class RevokeRefreshTokenCommandHandler(AppDbContext dbContext)
        : IRequestHandler<RevokeRefreshTokenCommand>
    {
        public async Task Handle(RevokeRefreshTokenCommand request, CancellationToken cancellationToken)
        {
            await dbContext.RefreshTokens
                .Where(x => x.RefreshTokenId == request.Id)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(x => x.Revoked, true), cancellationToken);
        }
    }
}
