namespace UTB_AP5PW_Invoicer.Server.Areas.Admin.Models
{
    public class CreatePaymentModel
    {
        public int InvoiceId { get; set; }
        public DateTimeOffset PaymentDate { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; }
    }
}
