using AutoMapper;
using MediatR;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Invoices.Queries.Get
{
    public class GetInvoiceQueryHandler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<GetInvoiceQuery, InvoiceDto?>
    {
        public async Task<InvoiceDto?> Handle(GetInvoiceQuery request, CancellationToken cancellationToken)
        {
            var invoice = await dbContext.Invoices.FindAsync([request.Id], cancellationToken);
            return mapper.Map<InvoiceDto?>(invoice);
        }
    }
}
