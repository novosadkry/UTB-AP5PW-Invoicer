using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Services.Interfaces;
using UTB_AP5PW_Invoicer.Server.Areas.Client.Controllers;

namespace UTB_AP5PW_Invoicer.Tests.Controllers
{
    public class CustomersControllerTests
    {
        private static CustomerDto GetTestCustomer(int id)
        {
            return new CustomerDto
            {
                Id = id,
                Name = "Customer 1",
                UserId = 10
            };
        }

        [Fact]
        public async Task GetCustomers_ReturnsListFromService()
        {
            var mockService = new Mock<ICustomerService>();
            var customers = new List<CustomerDto> { GetTestCustomer(1), GetTestCustomer(2) };
            mockService.Setup(s => s.ListCustomersAsync()).ReturnsAsync(customers);

            var controller = new CustomersController(mockService.Object);
            var result = await controller.GetCustomers();

            Assert.Equal(2, result.Count);
            mockService.Verify(s => s.ListCustomersAsync(), Times.Once);
        }

        [Fact]
        public async Task GetCustomer_ReturnsOk_WhenCustomerExists()
        {
            var mockService = new Mock<ICustomerService>();
            var customer = GetTestCustomer(1);
            mockService.Setup(s => s.GetCustomerByIdAsync(1)).ReturnsAsync(customer);

            var controller = new CustomersController(mockService.Object);
            var result = await controller.GetCustomer(1);

            var ok = Assert.IsType<OkObjectResult>(result.Result);
            Assert.Equal(customer, ok.Value);
            mockService.Verify(s => s.GetCustomerByIdAsync(1), Times.Once);
        }

        [Fact]
        public async Task GetCustomer_ReturnsNotFound_WhenCustomerDoesNotExist()
        {
            var mockService = new Mock<ICustomerService>();
            mockService.Setup(s => s.GetCustomerByIdAsync(1)).ReturnsAsync((CustomerDto?)null);

            var controller = new CustomersController(mockService.Object);
            var result = await controller.GetCustomer(1);

            Assert.IsType<NotFoundResult>(result.Result);
            mockService.Verify(s => s.GetCustomerByIdAsync(1), Times.Once);
        }

        [Fact]
        public async Task CreateCustomer_CallsService_AndReturnsCreatedAt()
        {
            var mockService = new Mock<ICustomerService>();
            var httpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, "1")]))
            };
            var customer = GetTestCustomer(1);

            var controller = new CustomersController(mockService.Object)
            {
                ControllerContext = new ControllerContext { HttpContext = httpContext }
            };
            var result = await controller.CreateCustomer(customer);

            Assert.IsType<CreatedAtActionResult>(result);
            mockService.Verify(s => s.CreateCustomerAsync(customer), Times.Once);
        }

        [Fact]
        public async Task DeleteCustomer_CallsService_AndReturnsOk()
        {
            var mockService = new Mock<ICustomerService>();

            var controller = new CustomersController(mockService.Object);
            var result = await controller.DeleteCustomer(1);

            Assert.IsType<OkResult>(result);
            mockService.Verify(s => s.DeleteCustomerAsync(It.Is<CustomerDto>(c => c.Id == 1)), Times.Once);
        }
    }
}
