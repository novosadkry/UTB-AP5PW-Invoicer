using MediatR;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Invoices.Commands.GenerateShareToken
{
    public class GenerateShareTokenCommandHandler(AppDbContext dbContext)
        : IRequestHandler<GenerateShareTokenCommand, string?>
    {
        public async Task<string?> Handle(GenerateShareTokenCommand request, CancellationToken cancellationToken)
        {
            var invoice = await dbContext.Invoices.FindAsync([request.InvoiceId], cancellationToken);
            if (invoice == null) return null;

            if (!string.IsNullOrEmpty(invoice.ShareToken))
                return invoice.ShareToken;

            invoice.ShareToken = Guid.NewGuid().ToString("N");
            invoice.UpdatedAt = DateTimeOffset.UtcNow;
            await dbContext.SaveChangesAsync(cancellationToken);

            return invoice.ShareToken;
        }
    }
}
