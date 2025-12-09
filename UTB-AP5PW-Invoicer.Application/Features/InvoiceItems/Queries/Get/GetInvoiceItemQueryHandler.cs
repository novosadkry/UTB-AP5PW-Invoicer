using AutoMapper;
using MediatR;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.InvoiceItems.Queries.Get
{
    public class GetInvoiceItemQueryHandler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<GetInvoiceItemQuery, InvoiceItemDto?>
    {
        public async Task<InvoiceItemDto?> Handle(GetInvoiceItemQuery request, CancellationToken cancellationToken)
        {
            var invoiceItem = await dbContext.InvoiceItems.FindAsync([request.Id], cancellationToken);
            return mapper.Map<InvoiceItemDto?>(invoiceItem);
        }
    }
}
