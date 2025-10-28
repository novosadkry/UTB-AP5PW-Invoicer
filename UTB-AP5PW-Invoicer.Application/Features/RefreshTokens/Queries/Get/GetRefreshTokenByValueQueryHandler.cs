using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.RefreshTokens.Queries.Get
{
    public class GetRefreshTokenByValueQueryHandler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<GetRefreshTokenByValueQuery, RefreshTokenDto?>
    {
        public async Task<RefreshTokenDto?> Handle(GetRefreshTokenByValueQuery request, CancellationToken cancellationToken)
        {
            var refreshToken = await dbContext.RefreshTokens
                .SingleOrDefaultAsync(x => x.Token == request.Token, cancellationToken);

            return mapper.Map<RefreshTokenDto?>(refreshToken);
        }
    }
}
