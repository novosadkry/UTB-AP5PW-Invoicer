using MediatR;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.InvoiceItems.Commands.Delete
{
    public class DeleteInvoiceItemCommandHandler(AppDbContext dbContext)
        : IRequestHandler<DeleteInvoiceItemCommand, bool>
    {
        public async Task<bool> Handle(DeleteInvoiceItemCommand request, CancellationToken cancellationToken)
        {
            var invoiceItem = await dbContext.InvoiceItems.FindAsync([request.Id], cancellationToken);
            if (invoiceItem == null) return false;

            dbContext.InvoiceItems.Remove(invoiceItem);
            await dbContext.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
