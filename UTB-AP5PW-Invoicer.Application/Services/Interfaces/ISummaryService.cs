using UTB_AP5PW_Invoicer.Application.DTOs;

namespace UTB_AP5PW_Invoicer.Application.Services.Interfaces
{
    public interface ISummaryService : IService
    {
        public Task<DashboardSummaryDto> GetDashboardSummaryAsync(UserDto user);
    }
}
