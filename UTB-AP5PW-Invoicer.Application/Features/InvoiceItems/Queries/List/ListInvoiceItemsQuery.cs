using MediatR;
using UTB_AP5PW_Invoicer.Application.DTOs;

namespace UTB_AP5PW_Invoicer.Application.Features.InvoiceItems.Queries.List
{
    public record ListInvoiceItemsQuery(int InvoiceId) : IRequest<ICollection<InvoiceItemDto>>;
}
