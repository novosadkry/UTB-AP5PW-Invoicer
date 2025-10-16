using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Invoices.Queries.List
{
    public class ListInvoicesQueryHandler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<ListInvoicesQuery, List<InvoiceDto>>
    {
        public async Task<List<InvoiceDto>> Handle(ListInvoicesQuery request, CancellationToken cancellationToken)
        {
            return await dbContext.Invoices
                .AsNoTracking()
                .ProjectTo<InvoiceDto>(mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);
        }
    }
}
