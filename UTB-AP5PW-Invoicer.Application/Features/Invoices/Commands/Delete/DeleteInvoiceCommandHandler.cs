using MediatR;
using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Invoices.Commands.Delete
{
    public class DeleteInvoiceCommandHandler(AppDbContext dbContext)
        : IRequestHandler<DeleteInvoiceCommand>
    {
        public async Task Handle(DeleteInvoiceCommand request, CancellationToken cancellationToken)
        {
            await dbContext.Invoices
                .Where(x => x.InvoiceId == request.Id)
                .ExecuteDeleteAsync(cancellationToken);
        }
    }
}
