using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Domain.Entities;
using UTB_AP5PW_Invoicer.Application.Services;

namespace UTB_AP5PW_Invoicer.Infrastructure.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly AppDbContext _dbContext;

        public InvoiceService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Invoice?> GetInvoiceByIdAsync(int invoiceId)
        {
            return await _dbContext.Invoices
                .FirstOrDefaultAsync(x => x.InvoiceId == invoiceId);
        }

        public async Task CreateInvoiceAsync(Invoice invoice)
        {
            _dbContext.Invoices.Add(invoice);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<Invoice>> GetAllInvoicesAsync()
        {
            return await _dbContext.Invoices.ToListAsync();
        }

        public async Task DeleteInvoiceAsync(Invoice invoice)
        {
            _dbContext.Invoices.Remove(invoice);
            await _dbContext.SaveChangesAsync();
        }
    }
}
