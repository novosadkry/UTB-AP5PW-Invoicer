using MediatR;
using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Invoices.Commands.Delete
{
    public class DeleteInvoiceCommandHandler(AppDbContext dbContext)
        : IRequestHandler<DeleteInvoiceCommand, bool>
    {
        public async Task<bool> Handle(DeleteInvoiceCommand request, CancellationToken cancellationToken)
        {
            await dbContext.Invoices
                .Where(x => x.Id == request.Id)
                .ExecuteDeleteAsync(cancellationToken);

            return true;
        }
    }
}
