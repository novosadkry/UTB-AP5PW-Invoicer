using MediatR;

namespace UTB_AP5PW_Invoicer.Application.Features.Users.Commands.Create
{
    public record CreateUserCommand : IRequest<int>
    {
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string FullName { get; set; }
    }
}
