using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Users.Queries.List
{
    public class ListUsersQueryHandler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<ListUsersQuery, ICollection<UserDto>>
    {
        public async Task<ICollection<UserDto>> Handle(ListUsersQuery request, CancellationToken cancellationToken)
        {
            return await dbContext.Users
                .AsNoTracking()
                .ProjectTo<UserDto>(mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);
        }
    }
}
