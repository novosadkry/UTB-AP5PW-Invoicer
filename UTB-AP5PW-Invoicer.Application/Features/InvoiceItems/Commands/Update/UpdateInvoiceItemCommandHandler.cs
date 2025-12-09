using AutoMapper;
using MediatR;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.InvoiceItems.Commands.Update
{
    public class UpdateInvoiceItemCommandHandler(AppDbContext dbContext)
        : IRequestHandler<UpdateInvoiceItemCommand, bool>
    {
        public async Task<bool> Handle(UpdateInvoiceItemCommand request, CancellationToken cancellationToken)
        {
            var invoiceItem = await dbContext.InvoiceItems.FindAsync([request.Id], cancellationToken);
            if (invoiceItem == null) return false;

            invoiceItem.Description = request.Description;
            invoiceItem.Quantity = request.Quantity;
            invoiceItem.UnitPrice = request.UnitPrice;
            invoiceItem.TotalPrice = request.Quantity * request.UnitPrice;

            await dbContext.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
