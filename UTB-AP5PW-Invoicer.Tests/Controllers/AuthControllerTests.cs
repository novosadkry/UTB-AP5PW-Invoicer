using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Services;
using UTB_AP5PW_Invoicer.Domain.Entities;
using UTB_AP5PW_Invoicer.Server.Controllers;
using UTB_AP5PW_Invoicer.Server.Models;

namespace UTB_AP5PW_Invoicer.Tests.Controllers
{
    public class AuthControllerTests
    {
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
            var mockAuthService = new Mock<IAuthService>();

            mockUserService.Setup(x => x.GetUserByEmailAsync(user.Email)).ReturnsAsync(user);
            mockAuthService.Setup(x => x.VerifyPasswordAsync(user, "password")).ReturnsAsync(true);
            mockAuthService.Setup(x => x.GetAccessTokenAsync(user)).ReturnsAsync("valid_token");
            mockAuthService.Setup(x => x.GetRefreshTokenAsync(user)).ReturnsAsync("valid_refresh");

            var httpContext = new DefaultHttpContext();
            var controller = new AuthController(mockUserService.Object, mockAuthService.Object)
            {
                ControllerContext = new ControllerContext { HttpContext = httpContext }
            };

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
            Assert.Equal("valid_token", tokenElement.GetString());

            var setCookie = httpContext.Response.Headers.SetCookie.ToString();
            Assert.False(string.IsNullOrEmpty(setCookie));
            Assert.Contains("refreshToken=valid_refresh", setCookie);
        }

        [Fact]
        public async Task Login_ReturnsUnauthorized_WhenUserNotFound()
        {
            var user = GetTestUser();
            var mockUserService = new Mock<IUserService>();
            var mockAuthService = new Mock<IAuthService>();

            mockUserService.Setup(x => x.GetUserByEmailAsync(user.Email)).ReturnsAsync((UserDto?)null);

            var controller = new AuthController(mockUserService.Object, mockAuthService.Object);
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
            var mockAuthService = new Mock<IAuthService>();

            mockUserService.Setup(x => x.GetUserByEmailAsync(user.Email)).ReturnsAsync(user);
            mockAuthService.Setup(x => x.VerifyPasswordAsync(user, "password")).ReturnsAsync(false);

            var controller = new AuthController(mockUserService.Object, mockAuthService.Object);
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
            var mockAuthService = new Mock<IAuthService>();

            mockUserService.Setup(x => x.GetUserByEmailAsync(user.Email)).ReturnsAsync(user);

            var controller = new AuthController(mockUserService.Object, mockAuthService.Object);
            var result = await controller.Signup(new SignupModel
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
            var mockAuthService = new Mock<IAuthService>();

            mockUserService.Setup(x => x.GetUserByEmailAsync(user.Email)).ReturnsAsync((UserDto?)null);
            mockUserService.Setup(x => x.CreateUserAsync(user.Email, user.FullName, "password")).ReturnsAsync(1);
            mockUserService.Setup(x => x.GetUserAsync(1)).ReturnsAsync(user);
            mockAuthService.Setup(x => x.GetAccessTokenAsync(user)).ReturnsAsync("valid_token");
            mockAuthService.Setup(x => x.GetRefreshTokenAsync(user)).ReturnsAsync("new_refresh");

            var httpContext = new DefaultHttpContext();
            var controller = new AuthController(mockUserService.Object, mockAuthService.Object)
            {
                ControllerContext = new ControllerContext { HttpContext = httpContext }
            };

            var result = await controller.Signup(new SignupModel
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
            Assert.Equal("valid_token", tokenElement.GetString());

            var setCookie = httpContext.Response.Headers.SetCookie.ToString();
            Assert.False(string.IsNullOrEmpty(setCookie));
            Assert.Contains("refreshToken=new_refresh", setCookie);
        }

        [Fact]
        public async Task Refresh_ReturnsUnauthorized_WhenTokenInvalid()
        {
            var mockUserService = new Mock<IUserService>();
            var mockAuthService = new Mock<IAuthService>();
            var mockRequestCookies = new Mock<IRequestCookieCollection>();

            mockAuthService.Setup(x => x.ValidateRefreshTokenAsync("invalid_token")).ReturnsAsync((UserDto?)null);
            mockRequestCookies.Setup(x => x["refreshToken"]).Returns("invalid_token");

            var controller = new AuthController(mockUserService.Object, mockAuthService.Object)
            {
                ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext() },
                Request = { Cookies = mockRequestCookies.Object }
            };

            var result = await controller.RefreshToken();

            Assert.IsType<UnauthorizedResult>(result);
        }

        [Fact]
        public async Task Refresh_ReturnsOk_WithNewTokens_AndRevokesOldToken_WhenValid()
        {
            var user = GetTestUser();
            var mockUserService = new Mock<IUserService>();
            var mockAuthService = new Mock<IAuthService>();
            var mockRequestCookies = new Mock<IRequestCookieCollection>();

            mockAuthService.Setup(x => x.ValidateRefreshTokenAsync("valid_refresh")).ReturnsAsync(user);
            mockAuthService.Setup(x => x.RevokeRefreshTokenAsync("valid_refresh")).Returns(Task.CompletedTask);
            mockAuthService.Setup(x => x.GetAccessTokenAsync(user)).ReturnsAsync("new_access");
            mockAuthService.Setup(x => x.GetRefreshTokenAsync(user)).ReturnsAsync("new_refresh");
            mockRequestCookies.Setup(x => x["refreshToken"]).Returns("valid_refresh");

            var httpContext = new DefaultHttpContext();
            var controller = new AuthController(mockUserService.Object, mockAuthService.Object)
            {
                ControllerContext = new ControllerContext { HttpContext = httpContext },
                Request = { Cookies = mockRequestCookies.Object }
            };

            var result = await controller.RefreshToken();

            var ok = Assert.IsType<OkObjectResult>(result);
            var json = JsonSerializer.Serialize(ok.Value);
            using var doc = JsonDocument.Parse(json);

            Assert.True(doc.RootElement.TryGetProperty("accessToken", out var accessElement));
            Assert.Equal("new_access", accessElement.GetString());

            var setCookie = httpContext.Response.Headers.SetCookie.ToString();
            Assert.False(string.IsNullOrEmpty(setCookie));
            Assert.Contains("refreshToken=new_refresh", setCookie);

            mockAuthService.Verify(x => x.RevokeRefreshTokenAsync("valid_refresh"), Times.Once);
        }
    }
}
