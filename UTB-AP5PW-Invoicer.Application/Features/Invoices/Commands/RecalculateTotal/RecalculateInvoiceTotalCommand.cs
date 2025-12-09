using MediatR;

namespace UTB_AP5PW_Invoicer.Application.Features.Invoices.Commands.RecalculateTotal
{
    public record RecalculateInvoiceTotalCommand(int InvoiceId) : IRequest<bool>;
}
