using MediatR;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Customers.Commands.Delete
{
    public class DeleteCustomerCommandHandler(AppDbContext dbContext)
        : IRequestHandler<DeleteCustomerCommand>
    {
        public async Task Handle(DeleteCustomerCommand request, CancellationToken cancellationToken)
        {
            var customer = await dbContext.Customers.FindAsync(new object[] { request.Id }, cancellationToken);
            if (customer == null) return;

            dbContext.Customers.Remove(customer);
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
