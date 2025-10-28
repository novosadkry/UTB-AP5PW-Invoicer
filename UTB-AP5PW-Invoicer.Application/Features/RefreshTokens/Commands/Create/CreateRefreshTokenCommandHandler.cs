using AutoMapper;
using MediatR;
using UTB_AP5PW_Invoicer.Infrastructure.Authentication;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.RefreshTokens.Commands.Create
{
    public class CreateRefreshTokenCommandHandler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<CreateRefreshTokenCommand, Guid>
    {
        public async Task<Guid> Handle(CreateRefreshTokenCommand request, CancellationToken cancellationToken)
        {
            var refreshToken = mapper.Map<RefreshToken>(request);

            dbContext.RefreshTokens.Add(refreshToken);
            await dbContext.SaveChangesAsync(cancellationToken);

            return refreshToken.RefreshTokenId;
        }
    }
}
