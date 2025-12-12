using MediatR;
using UTB_AP5PW_Invoicer.Domain.Entities;

namespace UTB_AP5PW_Invoicer.Application.Features.Users.Commands.ChangeRole
{
    public record ChangeRoleCommand(int UserId, UserRole Role) : IRequest<bool>;
}
