using MediatR;

namespace UTB_AP5PW_Invoicer.Application.Features.Users.Commands.ForgotPassword
{
    public record ForgotPasswordCommand : IRequest<string?>
    {
        public string Email { get; set; }
    }
}
