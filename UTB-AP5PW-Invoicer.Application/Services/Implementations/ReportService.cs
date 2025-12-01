using MediatR;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Features.Reports.Queries;
using UTB_AP5PW_Invoicer.Application.Services.Interfaces;

namespace UTB_AP5PW_Invoicer.Application.Services.Implementations
{
    public class ReportService : IReportService
    {
        private readonly IMediator _mediator;

        public ReportService(IMediator mediator)
        {
            _mediator = mediator;
        }

        public Task<ReportDto> GetReportAsync(int userId, DateTimeOffset? periodStart, DateTimeOffset? periodEnd)
        {
            return _mediator.Send(new GetReportQuery
            {
                UserId = userId,
                PeriodStart = periodStart,
                PeriodEnd = periodEnd
            });
        }
    }
}
