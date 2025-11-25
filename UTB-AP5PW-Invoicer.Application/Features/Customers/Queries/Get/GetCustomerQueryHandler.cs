using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Customers.Queries.Get
{
    public class GetCustomerQueryHandler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<GetCustomerQuery, CustomerDto?>
    {
        public async Task<CustomerDto?> Handle(GetCustomerQuery request, CancellationToken cancellationToken)
        {
            return await dbContext.Customers
                .Where(c => c.Id == request.Id)
                .ProjectTo<CustomerDto>(mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(cancellationToken);
        }
    }
}
