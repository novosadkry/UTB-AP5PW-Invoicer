using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Payments.Queries.List
{
    public class ListPaymentsQueryHandler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<ListPaymentsQuery, ICollection<PaymentDto>>
    {
        public async Task<ICollection<PaymentDto>> Handle(ListPaymentsQuery request, CancellationToken cancellationToken)
        {
            var payments = await dbContext.Payments
                .Where(p => p.InvoiceId == request.InvoiceId)
                .OrderByDescending(p => p.PaymentDate)
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            return mapper.Map<ICollection<PaymentDto>>(payments);
        }
    }
}
