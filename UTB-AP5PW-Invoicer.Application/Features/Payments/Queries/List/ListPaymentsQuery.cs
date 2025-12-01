using MediatR;
using UTB_AP5PW_Invoicer.Application.DTOs;

namespace UTB_AP5PW_Invoicer.Application.Features.Payments.Queries.List
{
    public record ListPaymentsQuery(int InvoiceId) : IRequest<ICollection<PaymentDto>>;
}
