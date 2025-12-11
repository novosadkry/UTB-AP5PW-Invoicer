using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Services.Interfaces;
using UTB_AP5PW_Invoicer.Server.Areas.Client.Controllers;

namespace UTB_AP5PW_Invoicer.Tests.Controllers
{
    public class SummaryControllerTests
    {
        [Fact]
        public async Task GetDashboardSummary_ReturnsOk_WithSummaryFromService()
        {
            var mockService = new Mock<ISummaryService>();
            var mockMapper = new Mock<IMapper>();
            var summary = new DashboardSummaryDto { TotalInvoices = 5 };
            mockService.Setup(s => s.GetDashboardSummaryAsync(It.IsAny<UserDto>())).ReturnsAsync(summary);

            var httpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, "1")]))
            };
            var controller = new SummaryController(mockService.Object, mockMapper.Object)
            {
                ControllerContext = new ControllerContext { HttpContext = httpContext }
            };

            var result = await controller.GetDashboardSummary();

            Assert.IsType<OkObjectResult>(result.Result);
            mockService.Verify(s => s.GetDashboardSummaryAsync(It.IsAny<UserDto>()), Times.Once);
        }
    }
}
