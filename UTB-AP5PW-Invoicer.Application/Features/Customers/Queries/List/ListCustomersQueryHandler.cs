using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Customers.Queries.List
{
    public class ListCustomersQueryHandler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<ListCustomersQuery, ICollection<CustomerDto>>
    {
        public async Task<ICollection<CustomerDto>> Handle(ListCustomersQuery request, CancellationToken cancellationToken)
        {
            return await dbContext.Customers
                .AsNoTracking()
                .ProjectTo<CustomerDto>(mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);
        }
    }
}
