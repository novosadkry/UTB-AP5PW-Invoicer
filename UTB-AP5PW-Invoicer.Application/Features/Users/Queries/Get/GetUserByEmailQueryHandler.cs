using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Users.Queries.Get
{
    public class GetUserByEmailQueryHandler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<GetUserByEmailQuery, UserDto?>
    {
        public async Task<UserDto?> Handle(GetUserByEmailQuery request, CancellationToken cancellationToken)
        {
            var user = await dbContext.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);

            return mapper.Map<UserDto?>(user);
        }
    }
}
