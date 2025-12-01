using MediatR;

namespace UTB_AP5PW_Invoicer.Application.Features.Users.Commands.ChangePassword
{
    public record ChangePasswordCommand : IRequest<bool>
    {
        public int UserId { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
