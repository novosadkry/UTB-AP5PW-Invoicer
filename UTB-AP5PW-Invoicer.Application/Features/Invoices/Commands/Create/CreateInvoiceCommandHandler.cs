using AutoMapper;
using MediatR;
using UTB_AP5PW_Invoicer.Domain.Entities;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Invoices.Commands.Create
{
    public class CreateInvoiceCommandHandler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<CreateInvoiceCommand, int>
    {
        public async Task<int> Handle(CreateInvoiceCommand request, CancellationToken cancellationToken)
        {
            var invoice = mapper.Map<Invoice>(request);

            dbContext.Invoices.Add(invoice);
            await dbContext.SaveChangesAsync(cancellationToken);

            return invoice.Id;
        }
    }
}
