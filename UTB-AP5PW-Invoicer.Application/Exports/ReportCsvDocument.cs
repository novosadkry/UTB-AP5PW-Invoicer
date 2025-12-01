using System.Text;
using UTB_AP5PW_Invoicer.Application.DTOs;

namespace UTB_AP5PW_Invoicer.Application.Exports
{
    public class ReportCsvDocument
    {
        private readonly ReportDto _report;

        public ReportCsvDocument(ReportDto report)
        {
            _report = report;
        }

        public byte[] GenerateCsv()
        {
            var sb = new StringBuilder();

            // Summary section
            sb.AppendLine("Přehled reportu");
            sb.AppendLine($"Období;{_report.PeriodStart:dd.MM.yyyy};{_report.PeriodEnd:dd.MM.yyyy}");
            sb.AppendLine($"Celkové tržby;{_report.TotalRevenue:N2} Kč");
            sb.AppendLine($"Celkem faktur;{_report.TotalInvoices}");
            sb.AppendLine($"Zaplacených faktur;{_report.PaidInvoices}");
            sb.AppendLine($"Nezaplacených faktur;{_report.UnpaidInvoices}");
            sb.AppendLine($"Faktur po splatnosti;{_report.OverdueInvoices}");
            sb.AppendLine($"Zaplacená částka;{_report.PaidAmount:N2} Kč");
            sb.AppendLine($"Nezaplacená částka;{_report.UnpaidAmount:N2} Kč");
            sb.AppendLine();

            // Revenue by customer section
            sb.AppendLine("Tržby podle zákazníků");
            sb.AppendLine("Zákazník;Tržby;Počet faktur");
            foreach (var customer in _report.RevenueByCustomer)
                sb.AppendLine($"{customer.CustomerName};{customer.Revenue:N2} Kč;{customer.InvoiceCount}");

            sb.AppendLine();

            // Monthly revenue section
            sb.AppendLine("Měsíční tržby");
            sb.AppendLine("Rok;Měsíc;Tržby;Počet faktur");
            foreach (var month in _report.MonthlyRevenue)
                sb.AppendLine($"{month.Year};{month.Month};{month.Revenue:N2} Kč;{month.InvoiceCount}");

            return Encoding.UTF8.GetBytes(sb.ToString());
        }
    }
}
