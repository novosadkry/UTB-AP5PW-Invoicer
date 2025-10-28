using AutoMapper;
using MediatR;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.RefreshTokens.Queries.Get
{
    public class GetRefreshTokenQueryHandler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<GetRefreshTokenQuery, RefreshTokenDto?>
    {
        public async Task<RefreshTokenDto?> Handle(GetRefreshTokenQuery request, CancellationToken cancellationToken)
        {
            var refreshToken = await dbContext.RefreshTokens.FindAsync([request.Id], cancellationToken);
            return mapper.Map<RefreshTokenDto?>(refreshToken);
        }
    }
}
