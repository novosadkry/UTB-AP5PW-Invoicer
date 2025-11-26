using MediatR;

namespace UTB_AP5PW_Invoicer.Application.Features.Customers.Commands.Create
{
    public record CreateCustomerCommand(
        int UserId,
        string Name,
        string? Ico,
        string? Dic,
        string Address,
        string ContactEmail,
        string ContactPhone
    ) : IRequest<int>;
}
