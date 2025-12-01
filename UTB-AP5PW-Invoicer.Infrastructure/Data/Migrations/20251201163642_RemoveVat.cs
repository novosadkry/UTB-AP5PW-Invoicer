using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UTB_AP5PW_Invoicer.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveVat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalVat",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "TotalVat",
                table: "InvoiceItems");

            migrationBuilder.DropColumn(
                name: "VatRate",
                table: "InvoiceItems");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "TotalVat",
                table: "Invoices",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalVat",
                table: "InvoiceItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "VatRate",
                table: "InvoiceItems",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
