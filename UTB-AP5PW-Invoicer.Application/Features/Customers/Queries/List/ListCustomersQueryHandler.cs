using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Customers.Queries.List
{
    public class ListCustomersQueryHandler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<ListCustomersQuery, IEnumerable<CustomerDto>>
    {
        public async Task<IEnumerable<CustomerDto>> Handle(ListCustomersQuery request, CancellationToken cancellationToken)
        {
            return await dbContext.Customers
                .ProjectTo<CustomerDto>(mapper.ConfigurationProvider)
                .ToListAsync(cancellationToken);
        }
    }
}
