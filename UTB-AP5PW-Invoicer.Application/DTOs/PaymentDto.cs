namespace UTB_AP5PW_Invoicer.Application.DTOs
{
    public record PaymentDto
    {
        public int Id { get; set; }
        public int InvoiceId { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaidAt { get; set; }
        public string Method { get; set; }
    }
}
