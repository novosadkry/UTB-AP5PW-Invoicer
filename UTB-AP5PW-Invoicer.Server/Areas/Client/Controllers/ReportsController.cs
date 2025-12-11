using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Exports;
using UTB_AP5PW_Invoicer.Application.Services.Interfaces;
using UTB_AP5PW_Invoicer.Server.Extensions;
using UTB_AP5PW_Invoicer.Server.Areas.Client.ViewModels;

namespace UTB_AP5PW_Invoicer.Server.Areas.Client.Controllers
{
    [ApiController]
    [Area("Client")]
    [Route("[area]/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;
        private readonly IMapper _mapper;

        public ReportsController(IReportService reportService, IMapper mapper)
        {
            _reportService = reportService;
            _mapper = mapper;
        }

        [HttpGet]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<ReportViewModel>> GetReport(
            [FromQuery] DateTimeOffset? periodStart,
            [FromQuery] DateTimeOffset? periodEnd)
        {
            var userId = HttpContext.User.GetUserId();
            var report = await _reportService.GetReportAsync(userId, periodStart, periodEnd);
            return Ok(_mapper.Map<ReportViewModel>(report));
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
