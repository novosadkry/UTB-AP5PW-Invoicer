using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Domain.Entities;

namespace UTB_AP5PW_Invoicer.Server.Exports
{
    public class InvoicePdfDocument : IDocument
    {
        private readonly InvoiceDto _invoice;
        private readonly CustomerDto? _customer;
        private readonly UserDto _user;
        private readonly ICollection<InvoiceItemDto> _items;
        private readonly ICollection<PaymentDto> _payments;

        public InvoicePdfDocument(
            InvoiceDto invoice,
            CustomerDto? customer,
            UserDto user,
            ICollection<InvoiceItemDto> items,
            ICollection<PaymentDto> payments)
        {
            _invoice = invoice;
            _customer = customer;
            _user = user;
            _items = items;
            _payments = payments;
        }

        public DocumentMetadata GetMetadata() => DocumentMetadata.Default;
        public DocumentSettings GetSettings() => DocumentSettings.Default;

        public void Compose(IDocumentContainer container)
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.DefaultTextStyle(x => x.FontSize(10));

                page.Header().Element(ComposeHeader);
                page.Content().Element(ComposeContent);
                page.Footer().Element(ComposeFooter);
            });
        }

        private void ComposeHeader(IContainer container)
        {
            container.Row(row =>
            {
                row.RelativeItem().Column(column =>
                {
                    column.Item().Text($"Faktura č. {_invoice.InvoiceNumber}")
                        .FontSize(20).Bold();

                    column.Item().Text(text =>
                    {
                        text.Span("Datum vystavení: ");
                        text.Span(_invoice.IssueDate.ToString("dd.MM.yyyy"));
                    });

                    column.Item().Text(text =>
                    {
                        text.Span("Datum splatnosti: ");
                        text.Span(_invoice.DueDate.ToString("dd.MM.yyyy"));
                    });

                    column.Item().Text(text =>
                    {
                        text.Span("Stav: ");
                        text.Span(GetStatusText(_invoice.Status)).Bold();
                    });
                });
            });
        }

        private void ComposeContent(IContainer container)
        {
            container.PaddingVertical(20).Column(column =>
            {
                column.Spacing(20);

                column.Item().Row(row =>
                {
                    row.RelativeItem().Element(ComposeSupplierInfo);
                    row.ConstantItem(50);
                    row.RelativeItem().Element(ComposeCustomerInfo);
                });

                column.Item().Element(ComposeItemsTable);
                column.Item().Element(ComposeSummary);

                if (_payments.Count > 0)
                    column.Item().Element(ComposePayments);
            });
        }

        private void ComposeSupplierInfo(IContainer container)
        {
            container.Column(column =>
            {
                column.Item().Text("Dodavatel").Bold().FontSize(12);
                column.Item().PaddingTop(5);

                column.Item().Text(_user.FullName);

                if (!string.IsNullOrEmpty(_user.CompanyName))
                    column.Item().Text(_user.CompanyName);

                if (!string.IsNullOrEmpty(_user.Ico))
                    column.Item().Text($"IČO: {_user.Ico}");

                if (!string.IsNullOrEmpty(_user.Dic))
                    column.Item().Text($"DIČ: {_user.Dic}");

                if (!string.IsNullOrEmpty(_user.CompanyAddress))
                    column.Item().Text(_user.CompanyAddress);

                column.Item().Text(_user.Email);

                if (!string.IsNullOrEmpty(_user.CompanyPhone))
                    column.Item().Text(_user.CompanyPhone);
            });
        }

        private void ComposeCustomerInfo(IContainer container)
        {
            container.Column(column =>
            {
                column.Item().Text("Odběratel").Bold().FontSize(12);
                column.Item().PaddingTop(5);

                if (_customer != null)
                {
                    column.Item().Text(_customer.Name);

                    if (!string.IsNullOrEmpty(_customer.Ico))
                        column.Item().Text($"IČO: {_customer.Ico}");

                    if (!string.IsNullOrEmpty(_customer.Dic))
                        column.Item().Text($"DIČ: {_customer.Dic}");

                    if (!string.IsNullOrEmpty(_customer.Address))
                        column.Item().Text(_customer.Address);

                    if (!string.IsNullOrEmpty(_customer.ContactEmail))
                        column.Item().Text(_customer.ContactEmail);

                    if (!string.IsNullOrEmpty(_customer.ContactPhone))
                        column.Item().Text(_customer.ContactPhone);
                }
                else
                {
                    column.Item().Text("Není uveden").Italic();
                }
            });
        }

        private void ComposeItemsTable(IContainer container)
        {
            container.Column(column =>
            {
                column.Item().Text("Položky").Bold().FontSize(12);
                column.Item().PaddingTop(5);

                column.Item().Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.RelativeColumn(4);
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                    });

                    table.Header(header =>
                    {
                        header.Cell().Element(InvoiceItemHeaderStyle).Text("Popis");
                        header.Cell().Element(InvoiceItemHeaderStyle).AlignRight().Text("Množství");
                        header.Cell().Element(InvoiceItemHeaderStyle).AlignRight().Text("Cena/ks");
                        header.Cell().Element(InvoiceItemHeaderStyle).AlignRight().Text("Celkem");
                    });

                    foreach (var item in _items)
                    {
                        table.Cell().Element(InvoiceItemCellStyle).Text(item.Description);
                        table.Cell().Element(InvoiceItemCellStyle).AlignRight().Text(item.Quantity.ToString());
                        table.Cell().Element(InvoiceItemCellStyle).AlignRight().Text($"{item.UnitPrice:N2} Kč");
                        table.Cell().Element(InvoiceItemCellStyle).AlignRight().Text($"{item.TotalPrice:N2} Kč");
                    }
                });
            });
        }

        private static IContainer InvoiceItemHeaderStyle(IContainer container)
        {
            return container.Background(Colors.Grey.Lighten3).Padding(5).DefaultTextStyle(x => x.Bold());
        }

        private static IContainer InvoiceItemCellStyle(IContainer container)
        {
            return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5);
        }

        private void ComposeSummary(IContainer container)
        {
            var totalPaid = _payments.Sum(p => p.Amount);
            var remaining = _invoice.TotalAmount - totalPaid;

            container.AlignRight().Width(200).Column(column =>
            {
                column.Item().PaddingTop(5).BorderTop(1).PaddingTop(5).Row(row =>
                {
                    row.RelativeItem().Text("Celkem:").Bold();
                    row.RelativeItem().AlignRight().Text($"{_invoice.TotalAmount:N2} Kč").Bold();
                });

                if (_payments.Count > 0)
                {
                    column.Item().PaddingTop(10).Row(row =>
                    {
                        row.RelativeItem().Text("Zaplaceno:");
                        row.RelativeItem().AlignRight().Text($"{totalPaid:N2} Kč");
                    });

                    column.Item().Row(row =>
                    {
                        row.RelativeItem().Text("Zbývá k úhradě:").Bold();
                        row.RelativeItem().AlignRight().Text($"{remaining:N2} Kč").Bold();
                    });
                }
            });
        }

        private void ComposePayments(IContainer container)
        {
            container.Column(column =>
            {
                column.Item().PaddingTop(20).Text("Historie plateb").Bold().FontSize(12);
                column.Item().PaddingTop(5);

                column.Item().Table(table =>
                {
                    table.ColumnsDefinition(columns =>
                    {
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                        columns.RelativeColumn();
                    });

                    table.Header(header =>
                    {
                        header.Cell().Element(PaymentHeaderStyle).Text("Datum");
                        header.Cell().Element(PaymentHeaderStyle).Text("Způsob platby");
                        header.Cell().Element(PaymentHeaderStyle).AlignRight().Text("Částka");
                    });

                    foreach (var payment in _payments.OrderBy(p => p.PaymentDate))
                    {
                        table.Cell().Element(PaymentCellStyle).Text(payment.PaymentDate.ToString("dd.MM.yyyy"));
                        table.Cell().Element(PaymentCellStyle).Text(payment.PaymentMethod);
                        table.Cell().Element(PaymentCellStyle).AlignRight().Text($"{payment.Amount:N2} Kč");
                    }
                });
            });
        }

        private static IContainer PaymentHeaderStyle(IContainer container)
        {
            return container.Background(Colors.Grey.Lighten3).Padding(5).DefaultTextStyle(x => x.Bold());
        }

        private static IContainer PaymentCellStyle(IContainer container)
        {
            return container.BorderBottom(1).BorderColor(Colors.Grey.Lighten2).Padding(5);
        }

        private void ComposeFooter(IContainer container)
        {
            container.AlignCenter().Text(text =>
            {
                text.Span("Strana ");
                text.CurrentPageNumber();
                text.Span(" z ");
                text.TotalPages();
            });
        }

        private static string GetStatusText(InvoiceStatus status)
        {
            return status switch
            {
                InvoiceStatus.Paid => "Zaplaceno",
                InvoiceStatus.Sent => "Odesláno",
                InvoiceStatus.Overdue => "Po splatnosti",
                InvoiceStatus.Draft => "Koncept",
                _ => status.ToString()
            };
        }
    }
}
