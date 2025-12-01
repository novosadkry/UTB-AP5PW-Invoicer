using UTB_AP5PW_Invoicer.Application.DTOs;

namespace UTB_AP5PW_Invoicer.Application.Services.Interfaces
{
    public interface IReportService : IService
    {
        Task<ReportDto> GetReportAsync(int userId, DateTimeOffset? periodStart, DateTimeOffset? periodEnd);
    }
}
