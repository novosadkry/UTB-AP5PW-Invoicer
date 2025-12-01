using MediatR;

namespace UTB_AP5PW_Invoicer.Application.Features.Invoices.Commands.Delete
{
    public record DeleteInvoiceCommand(int Id) : IRequest<bool>;
}
