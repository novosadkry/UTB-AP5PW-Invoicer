namespace UTB_AP5PW_Invoicer.Server.Areas.Client.Models
{
    public class CreateInvoiceItemModel
    {
        public string Description { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
