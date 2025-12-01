using MediatR;

namespace UTB_AP5PW_Invoicer.Application.Features.Payments.Commands.Create
{
    public record CreatePaymentCommand : IRequest<int>
    {
        public int InvoiceId { get; set; }
        public decimal Amount { get; set; }
        public DateTimeOffset PaymentDate { get; set; }
        public string PaymentMethod { get; set; }
    }
}
