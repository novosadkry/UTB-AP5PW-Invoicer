using MediatR;

namespace UTB_AP5PW_Invoicer.Application.Features.Customers.Commands.Update
{
    public record UpdateCustomerCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Ico { get; set; }
        public string? Dic { get; set; }
        public string Address { get; set; }
        public string ContactEmail { get; set; }
        public string ContactPhone { get; set; }
    }
}
