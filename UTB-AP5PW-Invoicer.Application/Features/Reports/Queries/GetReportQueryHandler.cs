using MediatR;
using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Domain.Entities;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Reports.Queries
{
    public class GetReportQueryHandler(AppDbContext dbContext)
        : IRequestHandler<GetReportQuery, ReportDto>
    {
        public async Task<ReportDto> Handle(GetReportQuery request, CancellationToken cancellationToken)
        {
            var periodStart = request.PeriodStart ?? DateTimeOffset.UtcNow.AddYears(-1);
            var periodEnd = request.PeriodEnd ?? DateTimeOffset.UtcNow;

            var invoicesQuery = dbContext.Invoices
                .Where(i => i.UserId == request.UserId)
                .Where(i => i.IssueDate >= periodStart && i.IssueDate <= periodEnd)
                .Include(i => i.Customer)
                .Include(i => i.Payments)
                .AsNoTracking();

            var invoices = await invoicesQuery.ToListAsync(cancellationToken);

            var totalRevenue = invoices.Sum(i => i.TotalAmount);
            var totalInvoices = invoices.Count;
            var paidInvoices = invoices.Count(i => i.Status == InvoiceStatus.Paid);
            var unpaidInvoices = invoices.Count(i => i.Status != InvoiceStatus.Paid);
            var overdueInvoices = invoices.Count(i => i.Status == InvoiceStatus.Overdue);
            var paidAmount = invoices.Where(i => i.Status == InvoiceStatus.Paid)
                .Sum(i => i.TotalAmount);
            var unpaidAmount = invoices.Where(i => i.Status != InvoiceStatus.Paid)
                .Sum(i => i.TotalAmount);

            var revenueByCustomer = invoices
                .Where(i => i.Customer != null)
                .GroupBy(i => new { i.CustomerId, CustomerName = i.Customer!.Name })
                .Select(g => new CustomerRevenueDto
                {
                    CustomerId = g.Key.CustomerId ?? 0,
                    CustomerName = g.Key.CustomerName,
                    Revenue = g.Sum(i => i.TotalAmount),
                    InvoiceCount = g.Count()
                })
                .OrderByDescending(c => c.Revenue)
                .ToList();

            var monthlyRevenue = invoices
                .GroupBy(i => new { i.IssueDate.Year, i.IssueDate.Month })
                .Select(g => new MonthlyRevenueDto
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    Revenue = g.Sum(i => i.TotalAmount),
                    InvoiceCount = g.Count()
                })
                .OrderBy(m => m.Year)
                .ThenBy(m => m.Month)
                .ToList();

            return new ReportDto
            {
                PeriodStart = periodStart,
                PeriodEnd = periodEnd,
                TotalRevenue = totalRevenue,
                TotalInvoices = totalInvoices,
                PaidInvoices = paidInvoices,
                UnpaidInvoices = unpaidInvoices,
                OverdueInvoices = overdueInvoices,
                PaidAmount = paidAmount,
                UnpaidAmount = unpaidAmount,
                RevenueByCustomer = revenueByCustomer,
                MonthlyRevenue = monthlyRevenue
            };
        }
    }
}
