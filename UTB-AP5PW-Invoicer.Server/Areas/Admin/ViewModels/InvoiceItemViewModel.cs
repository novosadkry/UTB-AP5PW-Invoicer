namespace UTB_AP5PW_Invoicer.Server.Areas.Admin.ViewModels
{
    public class InvoiceItemViewModel
    {
        public int Id { get; set; }
        public int InvoiceId { get; set; }
        public string Description { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
