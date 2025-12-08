using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UTB_AP5PW_Invoicer.Application.Services.Interfaces;
using UTB_AP5PW_Invoicer.Server.Areas.Client.Models;
using UTB_AP5PW_Invoicer.Server.Extensions;

namespace UTB_AP5PW_Invoicer.Server.Areas.Client.Controllers
{
    [ApiController]
    [Area("Client")]
    [Route("[area]/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;
        private readonly IUserService _userService;
        private readonly IAuthService _authService;

        public AuthController(
            ILogger<AuthController> logger,
            IUserService userService,
            IAuthService authService)
        {
            _logger = logger;
            _userService = userService;
            _authService = authService;
        }

        [HttpPost]
        [Route("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] LoginModel request)
        {
            _logger.LogTrace("Login attempt for User[Email={Email}]", request.Email);

            var user = await _userService.GetUserByEmailAsync(request.Email);

            if (user == null || !await _authService.VerifyPasswordAsync(user, request.Password))
            {
                _logger.LogTrace("Login failed for User[Email={Email}]", request.Email);
                return Unauthorized();
            }

            var accessToken = await _authService.GetAccessTokenAsync(user);
            var refreshToken = await _authService.GetRefreshTokenAsync(user);

            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });

            _logger.LogTrace("Login succeeded for User[Id={UserId}]", user.Id);

            return Ok(new
            {
                accessToken,
                user = new { user.Id, user.Email, user.FullName, user.Role }
            });
        }

        [HttpPost]
        [Route("logout")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> Logout()
        {
            var token = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(token))
            {
                _logger.LogTrace("User logged out");
                return Ok();
            }

            await _authService.RevokeRefreshTokenAsync(token);
            Response.Cookies.Delete("refreshToken");

            _logger.LogTrace("User logged out and refresh token revoked");

            return Ok();
        }

        [HttpPost]
        [Route("signup")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> Signup([FromBody] SignupModel request)
        {
            _logger.LogTrace("Signup attempt for User[Email={Email}]", request.Email);

            var existingUser = await _userService.GetUserByEmailAsync(request.Email);
            if (existingUser != null)
            {
                _logger.LogTrace("Signup failed because User[Email={Email}] already exists", request.Email);
                return Conflict();
            }

            var userId = await _userService.CreateUserAsync(request.Email, request.FullName, request.Password);
            var user = await _userService.GetUserAsync(userId);
            if (user == null)
            {
                _logger.LogError("User creation failed for User[Email={Email}]", request.Email);
                return StatusCode(500, "User creation failed");
            }

            var accessToken = await _authService.GetAccessTokenAsync(user);
            var refreshToken = await _authService.GetRefreshTokenAsync(user);

            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            });

            _logger.LogTrace("Signup succeeded for User[Email={Email}]", user.Email);

            return Ok(new
            {
                accessToken,
                user = new { user.Id, user.Email, user.FullName, user.Role }
            });
        }

        [HttpPost]
        [Route("refresh")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> RefreshToken()
        {
            var token = Request.Cookies["refreshToken"];
            if (string.IsNullOrEmpty(token))
            {
                _logger.LogTrace("Refresh token requested without refresh token cookie present");
                return Unauthorized();
            }

            var user = await _authService.ValidateRefreshTokenAsync(token);
            if (user == null)
            {
                _logger.LogTrace("Refresh token validation failed");
                return Unauthorized();
            }

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

            _logger.LogTrace("Refresh token succeeded for User[Id={UserId}]", user.Id);

            return Ok(new
            {
                accessToken,
                user = new { user.Id, user.Email, user.FullName, user.Role }
            });
        }

        [HttpPost("change-password")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordModel model)
        {
            var userId = HttpContext.User.GetUserId();
            var user = await _userService.GetUserAsync(userId);

            if (user == null)
                return Unauthorized();

            var isCurrentValid = await _authService.VerifyPasswordAsync(user, model.CurrentPassword);
            if (!isCurrentValid) return BadRequest("Current password is incorrect");

            var result = await _authService.ChangePasswordAsync(user, model.NewPassword);
            if (!result) return BadRequest("Unable to change password");

            return Ok();
        }

        [HttpPost("forgot-password")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordModel model)
        {
            var token = await _authService.ForgotPasswordAsync(model.Email);
            _logger.LogInformation("Created password reset token for User[Email={Email}]: {Token}", model.Email, token);

            // TODO: await _emailService.SendPasswordResetEmail(model.Email, token);

            return Ok();
        }

        [HttpPost("reset-password")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordModel model)
        {
            var result = await _authService.ResetPasswordAsync(model.Token, model.NewPassword);
            if (!result) return BadRequest("Invalid or expired reset token");
            return Ok();
        }
    }
}
