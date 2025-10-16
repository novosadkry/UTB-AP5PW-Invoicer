using AutoMapper;
using MediatR;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Users.Queries.Get
{
    public class GetUserQueryHandler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<GetUserQuery, UserDto?>
    {
        public async Task<UserDto?> Handle(GetUserQuery request, CancellationToken cancellationToken)
        {
            var user = await dbContext.Users.FindAsync([request.Id], cancellationToken);
            return mapper.Map<UserDto?>(user);
        }
    }
}
