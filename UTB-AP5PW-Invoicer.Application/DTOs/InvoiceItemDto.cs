namespace UTB_AP5PW_Invoicer.Application.DTOs
{
    public record InvoiceItemDto
    {
        public int Id { get; set; }
        public int InvoiceId { get; set; }
        public string Description { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal VatAmount { get; set; }
        public decimal LineTotal { get; set; }
    }
}
