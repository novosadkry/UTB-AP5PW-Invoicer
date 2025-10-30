using Microsoft.AspNetCore.Mvc;
using UTB_AP5PW_Invoicer.Application.Services;
using UTB_AP5PW_Invoicer.Server.Areas.Client.Models;

namespace UTB_AP5PW_Invoicer.Server.Areas.Client.Controllers
{
    [ApiController]
    [Area("Client")]
    [Route("[area]/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IAuthService _authService;

        public AuthController(IUserService userService, IAuthService authService)
        {
            _userService = userService;
            _authService = authService;
        }

        [HttpPost]
        [Route("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] LoginModel request)
        {
            var user = await _userService.GetUserByEmailAsync(request.Email);

            if (user == null || !await _authService.VerifyPasswordAsync(user, request.Password))
                return Unauthorized();

            var accessToken = await _authService.GetAccessTokenAsync(user);
            var refreshToken = await _authService.GetRefreshTokenAsync(user);

            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });

            return Ok(new
            {
                accessToken,
                user = new { user.Id, user.Email, user.FullName }
            });
        }

        [HttpPost]
        [Route("logout")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Logout()
        {
            var token = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(token)) return Ok();

            await _authService.RevokeRefreshTokenAsync(token);
            Response.Cookies.Delete("refreshToken");

            return Ok();
        }

        [HttpPost]
        [Route("signup")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> Signup([FromBody] SignupModel request)
        {
            var existingUser = await _userService.GetUserByEmailAsync(request.Email);
            if (existingUser != null) return Conflict();

            var userId = await _userService.CreateUserAsync(request.Email, request.FullName, request.Password);
            var user = await _userService.GetUserAsync(userId);
            if (user == null) return StatusCode(500, "User creation failed");

            var accessToken = await _authService.GetAccessTokenAsync(user);
            var refreshToken = await _authService.GetRefreshTokenAsync(user);

            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });

            return Ok(new
            {
                accessToken,
                user = new { user.Id, user.Email, user.FullName }
            });
        }

        [HttpPost]
        [Route("refresh")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> RefreshToken()
        {
            var token = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(token)) return Unauthorized();

            var user = await _authService.ValidateRefreshTokenAsync(token);
            if (user == null) return Unauthorized();

            await _authService.RevokeRefreshTokenAsync(token);

            var accessToken = await _authService.GetAccessTokenAsync(user);
            var refreshToken = await _authService.GetRefreshTokenAsync(user);

            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });

            return Ok(new
            {
                accessToken,
                user = new { user.Id, user.Email, user.FullName }
            });
        }
    }
}
