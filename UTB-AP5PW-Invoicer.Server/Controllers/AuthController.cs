using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Services;
using UTB_AP5PW_Invoicer.Server.Configuration;
using UTB_AP5PW_Invoicer.Server.Models;

namespace UTB_AP5PW_Invoicer.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly JwtOptions _jwtOptions;
        private readonly IUserService _userService;

        public AuthController(IOptions<JwtOptions> jwtOptions, IUserService userService)
        {
            _jwtOptions = jwtOptions.Value;
            _userService = userService;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel request)
        {
            var user = await _userService.GetUserByEmailAsync(request.Email);

            if (user == null || !await _userService.VerifyPasswordAsync(user, request.Password))
                return Unauthorized();

            var claims = GetUserClaims(user);
            var accessToken = GenerateJwtToken(claims, DateTime.Now.AddMinutes(15));

            return Ok(new { accessToken });
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

            var claims = GetUserClaims(user);
            var accessToken = GenerateJwtToken(claims, DateTime.Now.AddMinutes(15));

            return Ok(new { accessToken });
        }

        private static List<Claim> GetUserClaims(UserDto user)
        {
            return
            [
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            ];
        }

        private string GenerateJwtToken(IEnumerable<Claim> claims, DateTime expires)
        {
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_jwtOptions.SecretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: expires,
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
