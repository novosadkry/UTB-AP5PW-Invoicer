using UTB_AP5PW_Invoicer.Application.DTOs;

namespace UTB_AP5PW_Invoicer.Application.Services.Interfaces
{
    public interface IInvoiceItemService : IService
    {
        public Task<ICollection<InvoiceItemDto>> ListInvoiceItemsAsync(InvoiceDto invoice);
        public Task<InvoiceItemDto?> GetInvoiceItemByIdAsync(int id);
        public Task<int> CreateInvoiceItemAsync(InvoiceItemDto invoiceItem);
        public Task<bool> UpdateInvoiceItemAsync(InvoiceItemDto invoiceItem);
        public Task<bool> DeleteInvoiceItemAsync(InvoiceItemDto invoiceItem);
    }
}
