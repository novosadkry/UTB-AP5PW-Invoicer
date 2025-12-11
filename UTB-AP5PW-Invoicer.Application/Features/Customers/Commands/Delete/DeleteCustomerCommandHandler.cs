using MediatR;
using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Customers.Commands.Delete
{
    public class DeleteCustomerCommandHandler(AppDbContext dbContext)
        : IRequestHandler<DeleteCustomerCommand, bool>
    {
        public async Task<bool> Handle(DeleteCustomerCommand request, CancellationToken cancellationToken)
        {
            var customer = await dbContext.Customers.FindAsync([request.Id], cancellationToken);
            if (customer == null) return false;

            var invoiceCount = await dbContext.Invoices
                .CountAsync(i => i.CustomerId == request.Id, cancellationToken);
            if (invoiceCount > 0) return false;

            dbContext.Customers.Remove(customer);
            await dbContext.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
