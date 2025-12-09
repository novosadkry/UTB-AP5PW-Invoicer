using AutoMapper;
using MediatR;
using UTB_AP5PW_Invoicer.Domain.Entities;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.InvoiceItems.Commands.Create
{
    public class CreateInvoiceItemCommandHandler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<CreateInvoiceItemCommand, int>
    {
        public async Task<int> Handle(CreateInvoiceItemCommand request, CancellationToken cancellationToken)
        {
            var invoiceItem = mapper.Map<InvoiceItem>(request);
            invoiceItem.TotalPrice = invoiceItem.Quantity * invoiceItem.UnitPrice;

            await dbContext.InvoiceItems.AddAsync(invoiceItem, cancellationToken);
            await dbContext.SaveChangesAsync(cancellationToken);

            return invoiceItem.Id;
        }
    }
}
