using UTB_AP5PW_Invoicer.Application.DTOs;

namespace UTB_AP5PW_Invoicer.Application.Services.Interfaces
{
    public interface IInvoiceService : IService
    {
        public Task<ICollection<InvoiceDto>> ListInvoicesAsync();
        public Task<InvoiceDto?> GetInvoiceByIdAsync(int id);
        public Task<InvoiceDto?> GetInvoiceByShareTokenAsync(string token);
        public Task CreateInvoiceAsync(InvoiceDto invoice);
        public Task UpdateInvoiceAsync(InvoiceDto invoice);
        public Task DeleteInvoiceAsync(InvoiceDto invoice);
        public Task<string?> GenerateShareTokenAsync(int invoiceId);
    }
}
