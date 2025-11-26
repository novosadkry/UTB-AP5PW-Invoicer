using MediatR;
using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Invoices.Queries.Get
{
    public class GetInvoiceDashboardSummaryQueryHandler(AppDbContext dbContext)
        : IRequestHandler<GetInvoiceDashboardSummaryQuery, InvoiceDashboardSummaryDto>
    {
        public async Task<InvoiceDashboardSummaryDto> Handle(GetInvoiceDashboardSummaryQuery request, CancellationToken cancellationToken)
        {
            var invoicesQuery = dbContext.Invoices
                .AsNoTracking()
                .Include(i => i.Customer);

            var invoices = await invoicesQuery.ToListAsync(cancellationToken);

            var totalInvoices = invoices.Count;
            var unpaidInvoices = invoices.Count(i => !string.Equals(i.Status, "paid", StringComparison.OrdinalIgnoreCase));
            var overdueInvoices = invoices.Count(i => string.Equals(i.Status, "overdue", StringComparison.OrdinalIgnoreCase));
            var totalAmount = invoices.Sum(i => i.TotalAmount);

            var latestInvoices = invoices
                .OrderByDescending(i => i.IssueDate)
                .Take(5)
                .Select(i => new InvoiceSummaryDto
                {
                    Id = i.Id,
                    InvoiceNumber = i.InvoiceNumber,
                    CustomerName = i.Customer?.Name,
                    IssueDate = i.IssueDate,
                    DueDate = i.DueDate,
                    Status = i.Status,
                    TotalAmount = i.TotalAmount,
                })
                .ToList();

            return new InvoiceDashboardSummaryDto
            {
                TotalInvoices = totalInvoices,
                UnpaidInvoices = unpaidInvoices,
                OverdueInvoices = overdueInvoices,
                TotalAmount = totalAmount,
                LatestInvoices = latestInvoices,
            };
        }
    }
}
