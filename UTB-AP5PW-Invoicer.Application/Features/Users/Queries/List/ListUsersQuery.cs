using MediatR;
using UTB_AP5PW_Invoicer.Application.DTOs;

namespace UTB_AP5PW_Invoicer.Application.Features.Users.Queries.List
{
    public record ListUsersQuery : IRequest<ICollection<UserDto>>;
}
