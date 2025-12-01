using MediatR;
using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Domain.Entities;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Payments.Commands.Delete
{
    public class DeletePaymentCommandHandler(AppDbContext dbContext)
        : IRequestHandler<DeletePaymentCommand, bool>
    {
        public async Task<bool> Handle(DeletePaymentCommand request, CancellationToken cancellationToken)
        {
            var payment = await dbContext.Payments.FindAsync([request.Id], cancellationToken);
            if (payment == null)
                return false;

            var invoiceId = payment.InvoiceId;
            dbContext.Payments.Remove(payment);
            await dbContext.SaveChangesAsync(cancellationToken);

            // Update invoice status after removing payment
            var invoice = await dbContext.Invoices
                .Include(i => i.Payments)
                .FirstOrDefaultAsync(i => i.Id == invoiceId, cancellationToken);

            if (invoice != null)
            {
                var totalPaid = invoice.Payments.Sum(p => p.Amount);
                if (totalPaid >= invoice.TotalAmount)
                {
                    invoice.Status = InvoiceStatus.Paid;
                }
                else if (totalPaid > 0)
                {
                    invoice.Status = InvoiceStatus.Sent;
                }
                else
                {
                    // No payments, check if overdue
                    invoice.Status = invoice.DueDate < DateTimeOffset.UtcNow ? InvoiceStatus.Overdue : InvoiceStatus.Sent;
                }
                invoice.UpdatedAt = DateTimeOffset.UtcNow;
                await dbContext.SaveChangesAsync(cancellationToken);
            }

            return true;
        }
    }
}
