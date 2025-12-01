using MediatR;
using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.RefreshTokens.Commands.Delete
{
    public class DeleteRefreshTokenCommandHandler(AppDbContext dbContext)
        : IRequestHandler<DeleteRefreshTokenCommand, bool>
    {
        public async Task<bool> Handle(DeleteRefreshTokenCommand request, CancellationToken cancellationToken)
        {
            await dbContext.RefreshTokens
                .Where(x => x.RefreshTokenId == request.Id)
                .ExecuteDeleteAsync(cancellationToken);

            return true;
        }
    }
}
