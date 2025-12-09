using System.Security.Claims;
using MediatR;
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
        private readonly Mock<IInvoiceService> _mockInvoiceService;
        private readonly Mock<IUserService> _mockUserService;
        private readonly Mock<ICustomerService> _mockCustomerService;
        private readonly Mock<IInvoiceItemService> _mockInvoiceItemService;
        private readonly Mock<IMediator> _mockMediator;

        public InvoicesControllerTests()
        {
            _mockInvoiceService = new Mock<IInvoiceService>();
            _mockUserService = new Mock<IUserService>();
            _mockCustomerService = new Mock<ICustomerService>();
            _mockInvoiceItemService = new Mock<IInvoiceItemService>();
            _mockMediator = new Mock<IMediator>();
        }

        private InvoicesController CreateController()
        {
            return new InvoicesController(
                _mockInvoiceService.Object,
                _mockUserService.Object,
                _mockCustomerService.Object,
                _mockInvoiceItemService.Object,
                _mockMediator.Object);
        }

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
            var invoices = new List<InvoiceDto> { GetTestInvoice(1), GetTestInvoice(2) };
            _mockInvoiceService.Setup(s => s.ListInvoicesAsync()).ReturnsAsync(invoices);

            var controller = CreateController();
            var result = await controller.GetInvoices();

            Assert.Equal(2, result.Count());
            _mockInvoiceService.Verify(s => s.ListInvoicesAsync(), Times.Once);
        }

        [Fact]
        public async Task GetInvoice_ReturnsOk_WhenInvoiceExists()
        {
            var invoice = GetTestInvoice(1);
            _mockInvoiceService.Setup(s => s.GetInvoiceByIdAsync(1)).ReturnsAsync(invoice);

            var controller = CreateController();
            var result = await controller.GetInvoice(1);

            var ok = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(invoice, ok.Value);
            _mockInvoiceService.Verify(s => s.GetInvoiceByIdAsync(1), Times.Once);
        }

        [Fact]
        public async Task GetInvoice_ReturnsNotFound_WhenInvoiceDoesNotExist()
        {
            _mockInvoiceService.Setup(s => s.GetInvoiceByIdAsync(1)).ReturnsAsync((InvoiceDto?)null);

            var controller = CreateController();
            var result = await controller.GetInvoice(1);

            Assert.IsType<NotFoundResult>(result.Result);
            _mockInvoiceService.Verify(s => s.GetInvoiceByIdAsync(1), Times.Once);
        }

        [Fact]
        public async Task CreateInvoice_CallsService_AndReturnsCreatedAt()
        {
            var httpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, "1")]))
            };
            var invoice = GetTestInvoice(1);

            var controller = CreateController();
            controller.ControllerContext = new ControllerContext { HttpContext = httpContext };
            var result = await controller.CreateInvoice(invoice);

            Assert.IsType<CreatedAtActionResult>(result);
            _mockInvoiceService.Verify(s => s.CreateInvoiceAsync(invoice), Times.Once);
        }

        [Fact]
        public async Task DeleteInvoice_CallsService_AndReturnsOk()
        {
            var controller = CreateController();
            var result = await controller.DeleteInvoice(1);

            Assert.IsType<OkResult>(result);
            _mockInvoiceService.Verify(s => s.DeleteInvoiceAsync(It.Is<InvoiceDto>(i => i.Id == 1)), Times.Once);
        }
    }
}
