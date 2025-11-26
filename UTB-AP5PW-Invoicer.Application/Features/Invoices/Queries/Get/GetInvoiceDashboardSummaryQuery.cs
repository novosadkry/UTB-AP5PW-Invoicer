using MediatR;
using UTB_AP5PW_Invoicer.Application.DTOs;

namespace UTB_AP5PW_Invoicer.Application.Features.Invoices.Queries.Get
{
    public record GetInvoiceDashboardSummaryQuery : IRequest<InvoiceDashboardSummaryDto>;
}
