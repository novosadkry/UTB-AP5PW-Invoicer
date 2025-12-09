using UTB_AP5PW_Invoicer.Application.DTOs;

namespace UTB_AP5PW_Invoicer.Application.Services.Interfaces
{
    public interface IInvoiceService : IService
    {
        public Task<ICollection<InvoiceDto>> ListInvoicesAsync();
        public Task<InvoiceDto?> GetInvoiceByIdAsync(int id);
        public Task<InvoiceDto?> GetInvoiceByShareTokenAsync(string token);
        public Task<int> CreateInvoiceAsync(InvoiceDto invoice);
        public Task<bool> UpdateInvoiceAsync(InvoiceDto invoice);
        public Task<bool> DeleteInvoiceAsync(InvoiceDto invoice);
        public Task<string?> GenerateShareTokenAsync(InvoiceDto invoice);
        public Task RecalculateInvoiceTotalAsync(InvoiceDto invoice);
    }
}
