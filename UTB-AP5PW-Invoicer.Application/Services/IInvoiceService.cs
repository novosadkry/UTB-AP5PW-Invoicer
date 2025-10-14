using UTB_AP5PW_Invoicer.Domain.Entities;

namespace UTB_AP5PW_Invoicer.Application.Services
{
    public interface IInvoiceService
    {
        public Task<Invoice?> GetInvoiceByIdAsync(int invoiceId);
        public Task CreateInvoiceAsync(Invoice invoice);
        public Task<IEnumerable<Invoice>> GetAllInvoicesAsync();
        public Task DeleteInvoiceAsync(Invoice invoice);
    }
}
