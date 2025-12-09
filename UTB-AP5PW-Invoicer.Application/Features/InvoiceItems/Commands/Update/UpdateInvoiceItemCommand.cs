using MediatR;

namespace UTB_AP5PW_Invoicer.Application.Features.InvoiceItems.Commands.Update
{
    public record UpdateInvoiceItemCommand : IRequest<bool>
    {
        public int Id { get; set; }
        public int InvoiceId { get; set; }
        public string Description { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
