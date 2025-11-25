using MediatR;

namespace UTB_AP5PW_Invoicer.Application.Features.Customers.Commands.Update
{
    public record UpdateCustomerCommand(
        int Id,
        string Name,
        string? Ico,
        string? Dic,
        string Address,
        string ContactEmail,
        string ContactPhone
    ) : IRequest;
}
