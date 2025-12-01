using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Domain.Entities;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Payments.Commands.Create
{
    public class CreatePaymentCommandHandler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<CreatePaymentCommand, int>
    {
        public async Task<int> Handle(CreatePaymentCommand request, CancellationToken cancellationToken)
        {
            var payment = mapper.Map<Payment>(request);
            payment.CreatedAt = DateTimeOffset.UtcNow;
            payment.UpdatedAt = DateTimeOffset.UtcNow;

            dbContext.Payments.Add(payment);
            await dbContext.SaveChangesAsync(cancellationToken);

            var invoice = await dbContext.Invoices
                .Include(i => i.Payments)
                .FirstOrDefaultAsync(i => i.Id == request.InvoiceId, cancellationToken);

            if (invoice == null)
                return payment.Id;

            var totalPaid = invoice.Payments.Sum(p => p.Amount);
            if (totalPaid >= invoice.TotalAmount)
                invoice.Status = InvoiceStatus.Paid;

            invoice.UpdatedAt = DateTimeOffset.UtcNow;
            await dbContext.SaveChangesAsync(cancellationToken);

            return payment.Id;
        }
    }
}
