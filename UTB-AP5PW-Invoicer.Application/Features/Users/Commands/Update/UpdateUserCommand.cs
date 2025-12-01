using MediatR;

namespace UTB_AP5PW_Invoicer.Application.Features.Users.Commands.Update
{
    public record UpdateUserCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string? CompanyName { get; set; }
        public string? Ico { get; set; }
        public string? Dic { get; set; }
        public string? CompanyAddress { get; set; }
        public string? CompanyPhone { get; set; }
    }
}
