using MediatR;
using UTB_AP5PW_Invoicer.Application.DTOs;

namespace UTB_AP5PW_Invoicer.Application.Features.Summary.Queries
{
    public record GetDashboardSummaryQuery(int UserId) : IRequest<DashboardSummaryDto>;
}
