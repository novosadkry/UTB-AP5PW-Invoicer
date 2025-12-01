using AutoMapper;
using MediatR;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Payments.Queries.Get
{
    public class GetPaymentQueryHandler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<GetPaymentQuery, PaymentDto?>
    {
        public async Task<PaymentDto?> Handle(GetPaymentQuery request, CancellationToken cancellationToken)
        {
            var payment = await dbContext.Payments.FindAsync([request.Id], cancellationToken);
            return mapper.Map<PaymentDto?>(payment);
        }
    }
}
