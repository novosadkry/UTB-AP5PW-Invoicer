using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UTB_AP5PW_Invoicer.Application.DTOs;
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

            var csv = GenerateCsv(report);
            var bytes = Encoding.UTF8.GetBytes(csv);
            var fileName = $"report-{report.PeriodStart:yyyy-MM-dd}-{report.PeriodEnd:yyyy-MM-dd}.csv";

            return File(bytes, "text/csv", fileName);
        }

        private static string GenerateCsv(ReportDto report)
        {
            var sb = new StringBuilder();

            // Summary section
            sb.AppendLine("Přehled reportu");
            sb.AppendLine($"Období;{report.PeriodStart:dd.MM.yyyy};{report.PeriodEnd:dd.MM.yyyy}");
            sb.AppendLine($"Celkové tržby;{report.TotalRevenue:N2} Kč");
            sb.AppendLine($"Celkem faktur;{report.TotalInvoices}");
            sb.AppendLine($"Zaplacených faktur;{report.PaidInvoices}");
            sb.AppendLine($"Nezaplacených faktur;{report.UnpaidInvoices}");
            sb.AppendLine($"Faktur po splatnosti;{report.OverdueInvoices}");
            sb.AppendLine($"Zaplacená částka;{report.PaidAmount:N2} Kč");
            sb.AppendLine($"Nezaplacená částka;{report.UnpaidAmount:N2} Kč");
            sb.AppendLine();

            // Revenue by customer
            sb.AppendLine("Tržby podle zákazníků");
            sb.AppendLine("Zákazník;Tržby;Počet faktur");
            foreach (var customer in report.RevenueByCustomer)
            {
                sb.AppendLine($"{customer.CustomerName};{customer.Revenue:N2} Kč;{customer.InvoiceCount}");
            }
            sb.AppendLine();

            // Monthly revenue
            sb.AppendLine("Měsíční tržby");
            sb.AppendLine("Rok;Měsíc;Tržby;Počet faktur");
            foreach (var month in report.MonthlyRevenue)
            {
                sb.AppendLine($"{month.Year};{month.Month};{month.Revenue:N2} Kč;{month.InvoiceCount}");
            }

            return sb.ToString();
        }
    }
}
