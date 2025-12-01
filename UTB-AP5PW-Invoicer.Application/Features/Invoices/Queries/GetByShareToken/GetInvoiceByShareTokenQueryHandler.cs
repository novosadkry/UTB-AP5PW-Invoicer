using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Invoices.Queries.GetByShareToken
{
    public class GetInvoiceByShareTokenQueryHandler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<GetInvoiceByShareTokenQuery, InvoiceDto?>
    {
        public async Task<InvoiceDto?> Handle(GetInvoiceByShareTokenQuery request, CancellationToken cancellationToken)
        {
            var invoice = await dbContext.Invoices
                .FirstOrDefaultAsync(i => i.ShareToken == request.Token, cancellationToken);

            return mapper.Map<InvoiceDto?>(invoice);
        }
    }
}
