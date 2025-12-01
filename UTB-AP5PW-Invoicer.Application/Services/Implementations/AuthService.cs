using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Features.RefreshTokens.Commands.Create;
using UTB_AP5PW_Invoicer.Application.Features.RefreshTokens.Commands.Delete;
using UTB_AP5PW_Invoicer.Application.Features.RefreshTokens.Commands.Revoke;
using UTB_AP5PW_Invoicer.Application.Features.RefreshTokens.Queries.Get;
using UTB_AP5PW_Invoicer.Application.Features.Users.Queries.Get;
using UTB_AP5PW_Invoicer.Application.Services.Interfaces;
using UTB_AP5PW_Invoicer.Infrastructure.Configuration;

namespace UTB_AP5PW_Invoicer.Application.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly JwtOptions _jwtOptions;
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;

        public AuthService(IOptions<JwtOptions> jwtOptions, IMediator mediator, IMapper mapper)
        {
            _jwtOptions = jwtOptions.Value;
            _mediator = mediator;
            _mapper = mapper;
        }

        public Task<string> GetAccessTokenAsync(UserDto user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.FullName)
            };

            var expiresAt = DateTimeOffset.UtcNow.AddMinutes(15);
            var token = GenerateJwtToken(claims, expiresAt);

            return Task.FromResult(token);
        }

        public async Task<string> GetRefreshTokenAsync(UserDto user)
        {
            var token = Convert.ToBase64String(Guid.NewGuid().ToByteArray());

            var id = await _mediator.Send(new CreateRefreshTokenCommand
            {
                Token = token,
                UserId = user.Id,
                ExpiresAt = DateTimeOffset.UtcNow.AddDays(7)
            });

            var refreshToken = await _mediator.Send(new GetRefreshTokenQuery(id));
            return refreshToken?.Token ?? throw new Exception("Failed to create refresh token");
        }

        public Task<bool> VerifyPasswordAsync(UserDto? user, string password)
        {
            return Task.FromResult(
                user?.PasswordHash != null &&
                BCrypt.Net.BCrypt.Verify(password, user.PasswordHash));
        }

        public async Task<UserDto?> ValidateRefreshTokenAsync(string token)
        {
            var refreshToken = await _mediator.Send(new GetRefreshTokenByValueQuery(token));
            if (refreshToken == null || refreshToken.ExpiresAt < DateTimeOffset.UtcNow || refreshToken.Revoked)
                return null;

            return await _mediator.Send(new GetUserQuery(refreshToken.UserId));
        }

        public async Task<bool> DeleteRefreshTokenAsync(string token)
        {
            var refreshToken = await _mediator.Send(new GetRefreshTokenByValueQuery(token));
            if (refreshToken != null)
                return await _mediator.Send(new DeleteRefreshTokenCommand(refreshToken.Id));

            return false;
        }

        public async Task<bool> RevokeRefreshTokenAsync(string token)
        {
            var refreshToken = await _mediator.Send(new GetRefreshTokenByValueQuery(token));
            if (refreshToken is { Revoked: false })
                return await _mediator.Send(new RevokeRefreshTokenCommand(refreshToken.Id));

            return false;
        }

        private string GenerateJwtToken(IEnumerable<Claim> claims, DateTimeOffset expires)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: expires.UtcDateTime,
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
