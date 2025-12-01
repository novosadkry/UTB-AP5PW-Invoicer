using MediatR;

namespace UTB_AP5PW_Invoicer.Application.Features.Payments.Commands.Delete
{
    public record DeletePaymentCommand(int Id) : IRequest<bool>;
}
