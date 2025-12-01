using AutoMapper;
using MediatR;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Invoices.Commands.Update
{
    public class UpdateInvoiceCommandHandler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<UpdateInvoiceCommand, bool>
    {
        public async Task<bool> Handle(UpdateInvoiceCommand request, CancellationToken cancellationToken)
        {
            var invoice = await dbContext.Invoices.FindAsync([request.Id], cancellationToken);
            if (invoice == null) return false;

            mapper.Map(request, invoice);
            await dbContext.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
