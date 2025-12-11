using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Services.Interfaces;
using UTB_AP5PW_Invoicer.Server.Areas.Client.Controllers;
using UTB_AP5PW_Invoicer.Server.Areas.Client.Models;
using UTB_AP5PW_Invoicer.Server.Areas.Client.ViewModels;

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
            var mockMapper = new Mock<IMapper>();
            var customers = new List<CustomerDto> { GetTestCustomer(1), GetTestCustomer(2) };
            mockService.Setup(s => s.ListCustomersAsync()).ReturnsAsync(customers);
            mockMapper.Setup(m => m.Map<ICollection<CustomerViewModel>>(It.IsAny<object>()))
                .Returns(new List<CustomerViewModel>());

            var controller = new CustomersController(mockService.Object, mockMapper.Object);
            var result = await controller.GetCustomers();

            Assert.NotNull(result);
            mockService.Verify(s => s.ListCustomersAsync(), Times.Once);
        }

        [Fact]
        public async Task GetCustomer_ReturnsOk_WhenCustomerExists()
        {
            var mockService = new Mock<ICustomerService>();
            var mockMapper = new Mock<IMapper>();
            var customer = GetTestCustomer(1);
            mockService.Setup(s => s.GetCustomerByIdAsync(1)).ReturnsAsync(customer);

            var controller = new CustomersController(mockService.Object, mockMapper.Object);
            var result = await controller.GetCustomer(1);

            Assert.IsType<OkObjectResult>(result.Result);
            mockService.Verify(s => s.GetCustomerByIdAsync(1), Times.Once);
        }

        [Fact]
        public async Task GetCustomer_ReturnsNotFound_WhenCustomerDoesNotExist()
        {
            var mockService = new Mock<ICustomerService>();
            var mockMapper = new Mock<IMapper>();
            mockService.Setup(s => s.GetCustomerByIdAsync(1)).ReturnsAsync((CustomerDto?)null);

            var controller = new CustomersController(mockService.Object, mockMapper.Object);
            var result = await controller.GetCustomer(1);

            Assert.IsType<NotFoundResult>(result.Result);
            mockService.Verify(s => s.GetCustomerByIdAsync(1), Times.Once);
        }

        [Fact]
        public async Task CreateCustomer_CallsService_AndReturnsCreatedAt()
        {
            var mockService = new Mock<ICustomerService>();
            var mockMapper = new Mock<IMapper>();
            var httpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, "1")]))
            };
            var model = new CreateCustomerModel { Name = "Customer 1" };
            var customer = GetTestCustomer(1);
            
            mockMapper.Setup(m => m.Map<CustomerDto>(It.IsAny<CreateCustomerModel>())).Returns(customer);

            var controller = new CustomersController(mockService.Object, mockMapper.Object)
            {
                ControllerContext = new ControllerContext { HttpContext = httpContext }
            };
            var result = await controller.CreateCustomer(model);

            Assert.IsType<CreatedAtActionResult>(result);
            mockService.Verify(s => s.CreateCustomerAsync(It.IsAny<CustomerDto>()), Times.Once);
        }

        [Fact]
        public async Task DeleteCustomer_CallsService_AndReturnsOk()
        {
            var mockService = new Mock<ICustomerService>();
            var mockMapper = new Mock<IMapper>();

            var controller = new CustomersController(mockService.Object, mockMapper.Object);
            var result = await controller.DeleteCustomer(1);

            Assert.IsType<OkResult>(result);
            mockService.Verify(s => s.DeleteCustomerAsync(It.Is<CustomerDto>(c => c.Id == 1)), Times.Once);
        }
    }
}
