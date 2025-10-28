using Microsoft.AspNetCore.Mvc;
using UTB_AP5PW_Invoicer.Application.Services;
using UTB_AP5PW_Invoicer.Server.Models;

namespace UTB_AP5PW_Invoicer.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
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
        public async Task<IActionResult> Login([FromBody] LoginModel request)
        {
            var user = await _userService.GetUserByEmailAsync(request.Email);

            if (user == null || !await _authService.VerifyPasswordAsync(user, request.Password))
                return Unauthorized();

            var accessToken = await _authService.GetAccessTokenAsync(user);
            var refreshToken = await _authService.GetRefreshTokenAsync(user);

            return Ok(new { accessToken, refreshToken });
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel request)
        {
            var existingUser = await _userService.GetUserByEmailAsync(request.Email);
            if (existingUser != null) return Conflict();

            var userId = await _userService.CreateUserAsync(request.Email, request.FullName, request.Password);
            var user = await _userService.GetUserAsync(userId);
            if (user == null) return StatusCode(500, "User creation failed");

            var accessToken = await _authService.GetAccessTokenAsync(user);
            var refreshToken = await _authService.GetRefreshTokenAsync(user);

            return Ok(new { accessToken, refreshToken });
        }

        [HttpPost]
        [Route("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenModel request)
        {
            var user = await _authService.ValidateRefreshTokenAsync(request.Token);
            if (user == null) return Unauthorized();

            await _authService.RevokeRefreshTokenAsync(request.Token);

            var accessToken = await _authService.GetAccessTokenAsync(user);
            var refreshToken = await _authService.GetRefreshTokenAsync(user);

            return Ok(new { accessToken, refreshToken });
        }
    }
}
