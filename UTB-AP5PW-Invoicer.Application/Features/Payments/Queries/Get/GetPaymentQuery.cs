using MediatR;
using UTB_AP5PW_Invoicer.Application.DTOs;

namespace UTB_AP5PW_Invoicer.Application.Features.Payments.Queries.Get
{
    public record GetPaymentQuery(int Id) : IRequest<PaymentDto?>;
}
