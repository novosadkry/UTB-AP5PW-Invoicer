using MediatR;

namespace UTB_AP5PW_Invoicer.Application.Features.Customers.Commands.Delete
{
    public record DeleteCustomerCommand(int Id) : IRequest<bool>;
}
