using MediatR;
using UTB_AP5PW_Invoicer.Application.DTOs;

namespace UTB_AP5PW_Invoicer.Application.Features.Customers.Queries.Get
{
    public record GetCustomerQuery(int Id) : IRequest<CustomerDto?>;
}
