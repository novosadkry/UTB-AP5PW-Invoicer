namespace UTB_AP5PW_Invoicer.Server.Areas.Client.ViewModels
{
    public class PaymentViewModel
    {
        public int Id { get; set; }
        public int InvoiceId { get; set; }
        public DateTimeOffset PaymentDate { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; }
    }
}
