using MediatR;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Payments.Commands.Delete
{
    public class DeletePaymentCommandHandler(AppDbContext dbContext)
        : IRequestHandler<DeletePaymentCommand, bool>
    {
        public async Task<bool> Handle(DeletePaymentCommand request, CancellationToken cancellationToken)
        {
            var payment = await dbContext.Payments.FindAsync([request.Id], cancellationToken);
            if (payment == null) return false;

            dbContext.Payments.Remove(payment);
            await dbContext.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
