using AutoMapper;
using MediatR;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Invoices.Commands.Update
{
    public class UpdateInvoiceCommandHandler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<UpdateInvoiceCommand>
    {
        public async Task Handle(UpdateInvoiceCommand request, CancellationToken cancellationToken)
        {
            var invoice = await dbContext.Invoices.FindAsync([request.InvoiceId], cancellationToken);
            if (invoice == null) return;

            mapper.Map(request, invoice);
            await dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
