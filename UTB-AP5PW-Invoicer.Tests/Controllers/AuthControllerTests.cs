using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Moq;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Services;
using UTB_AP5PW_Invoicer.Domain.Entities;
using UTB_AP5PW_Invoicer.Server.Configuration;
using UTB_AP5PW_Invoicer.Server.Controllers;
using UTB_AP5PW_Invoicer.Server.Models;

namespace UTB_AP5PW_Invoicer.Tests.Controllers
{
    public class AuthControllerTests
    {
        private static IOptions<JwtOptions> GetJwtOptions()
        {
            return Options.Create(new JwtOptions { SecretKey = "UzTetmpB3sftq8QCW66uPnJOCSkNW792" });
        }

        private static UserDto GetTestUser()
        {
            return new UserDto
            {
                UserId = 1,
                Email = "test@example.com",
                FullName = "Test User",
                Role = UserRole.User
            };
        }

        [Fact]
        public async Task Login_ReturnsOk_WithAccessToken_WhenCredentialsValid()
        {
            var user = GetTestUser();
            var mockUserService = new Mock<IUserService>();
            mockUserService.Setup(x => x.GetUserByEmailAsync(user.Email)).ReturnsAsync(user);
            mockUserService.Setup(x => x.VerifyPasswordAsync(user, "password")).ReturnsAsync(true);

            var controller = new AuthController(GetJwtOptions(), mockUserService.Object);
            var result = await controller.Login(new LoginModel
            {
                Email = user.Email,
                Password = "password"
            });

            var ok = Assert.IsType<OkObjectResult>(result);
            var json = JsonSerializer.Serialize(ok.Value);
            using var doc = JsonDocument.Parse(json);
            Assert.True(doc.RootElement.TryGetProperty("accessToken", out var tokenElement));
            Assert.False(string.IsNullOrWhiteSpace(tokenElement.GetString()));
        }

        [Fact]
        public async Task Login_ReturnsUnauthorized_WhenUserNotFound()
        {
            var user = GetTestUser();
            var mockUserService = new Mock<IUserService>();
            mockUserService.Setup(x => x.GetUserByEmailAsync(user.Email)).ReturnsAsync((UserDto?)null);

            var controller = new AuthController(GetJwtOptions(), mockUserService.Object);
            var result = await controller.Login(new LoginModel
            {
                Email = user.Email,
                Password = "password"
            });

            Assert.IsType<UnauthorizedResult>(result);
        }

        [Fact]
        public async Task Login_ReturnsUnauthorized_WhenInvalidPassword()
        {
            var user = GetTestUser();
            var mockUserService = new Mock<IUserService>();
            mockUserService.Setup(x => x.GetUserByEmailAsync(user.Email)).ReturnsAsync(user);
            mockUserService.Setup(x => x.VerifyPasswordAsync(user, "password")).ReturnsAsync(false);

            var controller = new AuthController(GetJwtOptions(), mockUserService.Object);
            var result = await controller.Login(new LoginModel
            {
                Email = user.Email,
                Password = "password"
            });

            Assert.IsType<UnauthorizedResult>(result);
        }

        [Fact]
        public async Task Register_ReturnsConflict_WhenUserAlreadyExists()
        {
            var user = GetTestUser();
            var mockUserService = new Mock<IUserService>();
            mockUserService.Setup(x => x.GetUserByEmailAsync(user.Email)).ReturnsAsync(user);

            var controller = new AuthController(GetJwtOptions(), mockUserService.Object);
            var result = await controller.Register(new RegisterModel
            {
                Email = user.Email,
                FullName = user.FullName,
                Password = "password"
            });

            Assert.IsType<ConflictResult>(result);
        }

        [Fact]
        public async Task Register_ReturnsOk_WithAccessToken_WhenCreationSucceeds()
        {
            var user = GetTestUser();
            var mockUserService = new Mock<IUserService>();
            mockUserService.Setup(x => x.GetUserByEmailAsync(user.Email)).ReturnsAsync((UserDto?)null);
            mockUserService.Setup(x => x.CreateUserAsync(user.Email, user.FullName, "password")).ReturnsAsync(1);
            mockUserService.Setup(x => x.GetUserAsync(1)).ReturnsAsync(user);

            var controller = new AuthController(GetJwtOptions(), mockUserService.Object);
            var result = await controller.Register(new RegisterModel
            {
                Email = user.Email,
                FullName = user.FullName,
                Password = "password"
            });

            var ok = Assert.IsType<OkObjectResult>(result);
            var json = JsonSerializer.Serialize(ok.Value);
            using var doc = JsonDocument.Parse(json);
            Assert.True(doc.RootElement.TryGetProperty("accessToken", out var tokenElement));
            Assert.False(string.IsNullOrWhiteSpace(tokenElement.GetString()));
        }
    }
}
