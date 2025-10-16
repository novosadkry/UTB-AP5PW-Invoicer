using MediatR;
using UTB_AP5PW_Invoicer.Application.DTOs;

namespace UTB_AP5PW_Invoicer.Application.Features.Users.Queries.Get
{
    public record GetUserByEmailQuery(string Email) : IRequest<UserDto?>;
}
