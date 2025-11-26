using MediatR;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Features.Summary.Queries;
using UTB_AP5PW_Invoicer.Application.Services.Interfaces;

namespace UTB_AP5PW_Invoicer.Application.Services.Implementations
{
    public class SummaryService : ISummaryService
    {
        private readonly IMediator _mediator;

        public SummaryService(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task<DashboardSummaryDto> GetDashboardSummaryAsync(UserDto user)
        {
            return await _mediator.Send(new GetDashboardSummaryQuery(user.Id));
        }
    }
}
