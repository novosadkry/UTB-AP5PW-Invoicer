using MediatR;
using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Domain.Entities;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Summary.Queries
{
    public class GetDashboardSummaryQueryHandler(AppDbContext dbContext)
        : IRequestHandler<GetDashboardSummaryQuery, DashboardSummaryDto>
    {
        public async Task<DashboardSummaryDto> Handle(GetDashboardSummaryQuery request, CancellationToken cancellationToken)
        {
            var invoicesQuery = dbContext.Invoices
                .Where(i => i.UserId == request.UserId)
                .Include(i => i.Customer)
                .AsNoTracking();

            var invoices = await invoicesQuery.ToListAsync(cancellationToken);

            var totalInvoices = invoices.Count;
            var unpaidInvoices = invoices.Count(i => i.Status != InvoiceStatus.Paid);
            var overdueInvoices = invoices.Count(i => i.Status == InvoiceStatus.Overdue);
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

            var paymentsQuery = dbContext.Payments
                .Include(p => p.Invoice)
                    .ThenInclude(i => i.Customer)
                .Where(p => p.Invoice.UserId == request.UserId)
                .AsNoTracking();

            var latestPayments = await paymentsQuery
                .OrderByDescending(p => p.PaymentDate)
                .Take(5)
                .Select(p => new PaymentSummaryDto
                {
                    Id = p.Id,
                    InvoiceId = p.InvoiceId,
                    InvoiceNumber = p.Invoice.InvoiceNumber,
                    CustomerName = p.Invoice.Customer != null
                        ? p.Invoice.Customer.Name : null,
                    PaymentDate = p.PaymentDate,
                    Amount = p.Amount,
                    PaymentMethod = p.PaymentMethod,
                })
                .ToListAsync(cancellationToken);

            return new DashboardSummaryDto
            {
                TotalInvoices = totalInvoices,
                UnpaidInvoices = unpaidInvoices,
                OverdueInvoices = overdueInvoices,
                TotalAmount = totalAmount,
                LatestInvoices = latestInvoices,
                LatestPayments = latestPayments,
            };
        }
    }
}
