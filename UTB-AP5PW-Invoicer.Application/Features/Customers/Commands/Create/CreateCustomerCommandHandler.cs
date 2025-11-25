using AutoMapper;
using MediatR;
using UTB_AP5PW_Invoicer.Domain.Entities;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Customers.Commands.Create
{
    public class CreateCustomerCommandHandler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<CreateCustomerCommand>
    {
        public async Task Handle(CreateCustomerCommand request, CancellationToken cancellationToken)
        {
            var customer = mapper.Map<Customer>(request);
            await dbContext.Customers.AddAsync(customer, cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
