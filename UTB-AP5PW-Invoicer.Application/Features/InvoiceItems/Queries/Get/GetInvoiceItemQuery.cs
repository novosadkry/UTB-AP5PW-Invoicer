using MediatR;
using UTB_AP5PW_Invoicer.Application.DTOs;

namespace UTB_AP5PW_Invoicer.Application.Features.InvoiceItems.Queries.Get
{
    public record GetInvoiceItemQuery(int Id) : IRequest<InvoiceItemDto?>;
}
