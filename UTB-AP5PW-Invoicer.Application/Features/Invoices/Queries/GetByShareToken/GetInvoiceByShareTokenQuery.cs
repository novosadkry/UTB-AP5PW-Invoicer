using MediatR;
using UTB_AP5PW_Invoicer.Application.DTOs;

namespace UTB_AP5PW_Invoicer.Application.Features.Invoices.Queries.GetByShareToken
{
    public record GetInvoiceByShareTokenQuery(string Token) : IRequest<InvoiceDto?>;
}
