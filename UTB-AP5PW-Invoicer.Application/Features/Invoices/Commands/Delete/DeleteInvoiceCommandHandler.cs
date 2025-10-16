using MediatR;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Invoices.Commands.Delete
{
    public class DeleteInvoiceCommandHandler(AppDbContext dbContext)
        : IRequestHandler<DeleteInvoiceCommand>
    {
        public async Task Handle(DeleteInvoiceCommand request, CancellationToken cancellationToken)
        {
            var invoice = await dbContext.Invoices.FindAsync([request.Id], cancellationToken);
            if (invoice == null) return;

            dbContext.Invoices.Remove(invoice);
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
