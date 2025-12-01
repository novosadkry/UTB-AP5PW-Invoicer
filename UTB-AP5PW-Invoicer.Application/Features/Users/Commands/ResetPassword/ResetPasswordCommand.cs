using MediatR;

namespace UTB_AP5PW_Invoicer.Application.Features.Users.Commands.ResetPassword
{
    public record ResetPasswordCommand : IRequest<bool>
    {
        public string Token { get; set; }
        public string NewPassword { get; set; }
    }
}
