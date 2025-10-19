using AutoMapper;
using MediatR;
using Moq;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Features.Users.Commands.Create;
using UTB_AP5PW_Invoicer.Application.Features.Users.Queries.Get;
using UTB_AP5PW_Invoicer.Application.Services;

namespace UTB_AP5PW_Invoicer.Tests.Services
{
    public class UserServiceTests
    {
        [Fact]
        public async Task GetUserAsync_CallsMediatorWithGetUserQuery()
        {
            var mockMapper = new Mock<IMapper>();
            var mockMediator = new Mock<IMediator>();
            mockMediator.Setup(m =>
                m.Send(It.IsAny<GetUserQuery>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new UserDto { UserId = 1 });

            var service = new UserService(mockMediator.Object, mockMapper.Object);
            var result = await service.GetUserAsync(1);

            Assert.NotNull(result);
            mockMediator.Verify(m =>
                m.Send(It.Is<GetUserQuery>(q => q.Id == 1), It.IsAny<CancellationToken>()),
                Times.Once);
        }

        [Fact]
        public async Task VerifyPasswordAsync_ReturnsTrue_ForMatchingPassword()
        {
            var mockMapper = new Mock<IMapper>();
            var mockMediator = new Mock<IMediator>();
            var hashed = BCrypt.Net.BCrypt.HashPassword("secret");
            var user = new UserDto { PasswordHash = hashed };

            var service = new UserService(mockMediator.Object, mockMapper.Object);
            var ok = await service.VerifyPasswordAsync(user, "secret");

            Assert.True(ok);
        }

        [Fact]
        public async Task CreateUserAsync_SendsCreateCommand_AndReturnsId()
        {
            var mockMapper = new Mock<IMapper>();
            var mockMediator = new Mock<IMediator>();
            mockMediator.Setup(m =>
                m.Send(It.IsAny<CreateUserCommand>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            var service = new UserService(mockMediator.Object, mockMapper.Object);
            var id = await service.CreateUserAsync("a@b.com", "Name", "pw");

            Assert.Equal(1, id);
            mockMediator.Verify(m =>
                m.Send(It.Is<CreateUserCommand>(c =>
                    c.Email == "a@b.com" &&
                    c.FullName == "Name" &&
                    !string.IsNullOrWhiteSpace(c.PasswordHash)),
                    It.IsAny<CancellationToken>()),
                Times.Once);
        }
    }
}
