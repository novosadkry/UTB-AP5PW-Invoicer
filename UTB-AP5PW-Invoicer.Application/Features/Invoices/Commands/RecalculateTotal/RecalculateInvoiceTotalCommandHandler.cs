using MediatR;
using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Invoices.Commands.RecalculateTotal
{
    public class RecalculateInvoiceTotalCommandHandler(AppDbContext dbContext)
        : IRequestHandler<RecalculateInvoiceTotalCommand, bool>
    {
        public async Task<bool> Handle(RecalculateInvoiceTotalCommand request, CancellationToken cancellationToken)
        {
            var invoice = await dbContext.Invoices.FindAsync([request.InvoiceId], cancellationToken);
            if (invoice == null) return false;

            var totalAmount = await dbContext.InvoiceItems
                .Where(i => i.InvoiceId == request.InvoiceId)
                .SumAsync(i => i.TotalPrice, cancellationToken);

            invoice.TotalAmount = totalAmount;
            await dbContext.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
