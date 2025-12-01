using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Exports;
using UTB_AP5PW_Invoicer.Application.Services.Interfaces;
using UTB_AP5PW_Invoicer.Server.Extensions;

namespace UTB_AP5PW_Invoicer.Server.Areas.Client.Controllers
{
    [ApiController]
    [Area("Client")]
    [Route("[area]/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<ReportDto>> GetReport(
            [FromQuery] DateTimeOffset? periodStart,
            [FromQuery] DateTimeOffset? periodEnd)
        {
            var userId = HttpContext.User.GetUserId();
            var report = await _reportService.GetReportAsync(userId, periodStart, periodEnd);
            return Ok(report);
        }

        [HttpGet("csv")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> ExportReportToCsv(
            [FromQuery] DateTimeOffset? periodStart,
            [FromQuery] DateTimeOffset? periodEnd)
        {
            var userId = HttpContext.User.GetUserId();
            var report = await _reportService.GetReportAsync(userId, periodStart, periodEnd);

            var document = new ReportCsvDocument(report);
            var csvBytes = document.GenerateCsv();

            var fileName = $"report-{report.PeriodStart:yyyy-MM-dd}-{report.PeriodEnd:yyyy-MM-dd}.csv";
            return File(csvBytes, "text/csv", fileName);
        }
    }
}
