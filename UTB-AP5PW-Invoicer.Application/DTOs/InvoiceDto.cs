namespace UTB_AP5PW_Invoicer.Application.DTOs
{
    public record InvoiceDto
    {
        public int Id { get; set; }
        public int? CustomerId { get; set; }
        public string InvoiceNumber { get; set; }
        public DateTime IssueDate { get; set; }
        public DateTime DueDate { get; set; }
        public string Status { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal TotalVat { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
