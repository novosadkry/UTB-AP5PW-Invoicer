using AutoMapper;
using MediatR;
using Microsoft.Extensions.Options;
using Moq;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Services.Implementations;
using UTB_AP5PW_Invoicer.Infrastructure.Configuration;

namespace UTB_AP5PW_Invoicer.Tests.Services
{
    public class AuthServiceTests
    {
        private static IOptions<JwtOptions> GetJwtOptions()
        {
            return Options.Create(new JwtOptions { SecretKey = "UzTetmpB3sftq8QCW66uPnJOCSkNW792" });
        }

        [Fact]
        public async Task VerifyPasswordAsync_ReturnsTrue_ForMatchingPassword()
        {
            var mockMapper = new Mock<IMapper>();
            var mockMediator = new Mock<IMediator>();

            var hashed = BCrypt.Net.BCrypt.HashPassword("secret");
            var user = new UserDto { PasswordHash = hashed };

            var service = new AuthService(GetJwtOptions(), mockMediator.Object, mockMapper.Object);
            var ok = await service.VerifyPasswordAsync(user, "secret");

            Assert.True(ok);
        }
    }
}
