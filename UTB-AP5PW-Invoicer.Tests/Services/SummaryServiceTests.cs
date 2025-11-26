using MediatR;
using Moq;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Features.Summary.Queries;
using UTB_AP5PW_Invoicer.Application.Services.Implementations;

namespace UTB_AP5PW_Invoicer.Tests.Services
{
    public class SummaryServiceTests
    {
        [Fact]
        public async Task GetDashboardSummaryAsync_SendsQueryWithUserId()
        {
            var mockMediator = new Mock<IMediator>();
            var user = new UserDto { Id = 42 };
            var expected = new DashboardSummaryDto { TotalInvoices = 3 };

            mockMediator
                .Setup(m => m.Send(It.IsAny<GetDashboardSummaryQuery>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(expected);

            var service = new SummaryService(mockMediator.Object);
            var result = await service.GetDashboardSummaryAsync(user);

            Assert.Equal(expected, result);
            mockMediator.Verify(m =>
                m.Send(It.Is<GetDashboardSummaryQuery>(q => q.UserId == 42), It.IsAny<CancellationToken>()),
                Times.Once);
        }
    }
}
