using MediatR;

namespace UTB_AP5PW_Invoicer.Application.Features.InvoiceItems.Commands.Delete
{
    public record DeleteInvoiceItemCommand(int Id, int InvoiceId) : IRequest<bool>;
}
