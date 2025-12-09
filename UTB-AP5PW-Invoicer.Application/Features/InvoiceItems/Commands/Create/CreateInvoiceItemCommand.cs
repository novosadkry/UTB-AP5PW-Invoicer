using MediatR;

namespace UTB_AP5PW_Invoicer.Application.Features.InvoiceItems.Commands.Create
{
    public record CreateInvoiceItemCommand : IRequest<int>
    {
        public int InvoiceId { get; set; }
        public string Description { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
