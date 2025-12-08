using MediatR;

namespace UTB_AP5PW_Invoicer.Application.Features.Users.Commands.Delete
{
    public record DeleteUserCommand(int Id) : IRequest<bool>;
}
