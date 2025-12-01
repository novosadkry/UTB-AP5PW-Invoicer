using MediatR;

namespace UTB_AP5PW_Invoicer.Application.Features.Invoices.Commands.GenerateShareToken
{
    public record GenerateShareTokenCommand(int InvoiceId) : IRequest<string?>;
}
