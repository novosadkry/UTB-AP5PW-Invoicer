using MediatR;
using UTB_AP5PW_Invoicer.Application.DTOs;

namespace UTB_AP5PW_Invoicer.Application.Features.Customers.Queries.List
{
    public record ListCustomersQuery : IRequest<IEnumerable<CustomerDto>>;
}
