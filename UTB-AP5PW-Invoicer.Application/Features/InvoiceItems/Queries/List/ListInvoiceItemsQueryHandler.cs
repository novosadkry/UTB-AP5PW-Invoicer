using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.InvoiceItems.Queries.List
{
    public class ListInvoiceItemsQueryHandler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<ListInvoiceItemsQuery, ICollection<InvoiceItemDto>>
    {
        public async Task<ICollection<InvoiceItemDto>> Handle(ListInvoiceItemsQuery request, CancellationToken cancellationToken)
        {
            return await dbContext.InvoiceItems
                .Where(i => i.InvoiceId == request.InvoiceId)
                .ProjectTo<InvoiceItemDto>(mapper.ConfigurationProvider)
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }
    }
}
