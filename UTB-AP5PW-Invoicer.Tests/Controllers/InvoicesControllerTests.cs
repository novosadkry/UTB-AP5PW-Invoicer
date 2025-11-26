using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Services.Interfaces;
using UTB_AP5PW_Invoicer.Server.Areas.Client.Controllers;

namespace UTB_AP5PW_Invoicer.Tests.Controllers
{
    public class InvoicesControllerTests
    {
        private static InvoiceDto GetTestInvoice(int id)
        {
            return new InvoiceDto
            {
                Id = id,
                InvoiceNumber = $"INV-{id}",
                UserId = 10
            };
        }

        [Fact]
        public async Task GetInvoices_ReturnsListFromService()
        {
            var mockService = new Mock<IInvoiceService>();
            var invoices = new List<InvoiceDto> { GetTestInvoice(1), GetTestInvoice(2) };
            mockService.Setup(s => s.ListInvoicesAsync()).ReturnsAsync(invoices);

            var controller = new InvoicesController(mockService.Object);
            var result = await controller.GetInvoices();

            Assert.Equal(2, result.Count());
            mockService.Verify(s => s.ListInvoicesAsync(), Times.Once);
        }

        [Fact]
        public async Task GetInvoice_ReturnsOk_WhenInvoiceExists()
        {
            var mockService = new Mock<IInvoiceService>();
            var invoice = GetTestInvoice(1);
            mockService.Setup(s => s.GetInvoiceByIdAsync(1)).ReturnsAsync(invoice);

            var controller = new InvoicesController(mockService.Object);
            var result = await controller.GetInvoice(1);

            var ok = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(invoice, ok.Value);
            mockService.Verify(s => s.GetInvoiceByIdAsync(1), Times.Once);
        }

        [Fact]
        public async Task GetInvoice_ReturnsNotFound_WhenInvoiceDoesNotExist()
        {
            var mockService = new Mock<IInvoiceService>();
            mockService.Setup(s => s.GetInvoiceByIdAsync(1)).ReturnsAsync((InvoiceDto?)null);

            var controller = new InvoicesController(mockService.Object);
            var result = await controller.GetInvoice(1);

            Assert.IsType<NotFoundResult>(result.Result);
            mockService.Verify(s => s.GetInvoiceByIdAsync(1), Times.Once);
        }

        [Fact]
        public async Task CreateInvoice_CallsService_AndReturnsCreatedAt()
        {
            var mockService = new Mock<IInvoiceService>();
            var httpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, "1")]))
            };
            var invoice = GetTestInvoice(1);

            var controller = new InvoicesController(mockService.Object)
            {
                ControllerContext = new ControllerContext { HttpContext = httpContext }
            };
            var result = await controller.CreateInvoice(invoice);

            Assert.IsType<CreatedAtActionResult>(result);
            mockService.Verify(s => s.CreateInvoiceAsync(invoice), Times.Once);
        }

        [Fact]
        public async Task DeleteInvoice_CallsService_AndReturnsOk()
        {
            var mockService = new Mock<IInvoiceService>();

            var controller = new InvoicesController(mockService.Object);
            var result = await controller.DeleteInvoice(1);

            Assert.IsType<OkResult>(result);
            mockService.Verify(s => s.DeleteInvoiceAsync(It.Is<InvoiceDto>(i => i.Id == 1)), Times.Once);
        }
    }
}
