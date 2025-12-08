using UTB_AP5PW_Invoicer.Application.DTOs;

namespace UTB_AP5PW_Invoicer.Application.Services.Interfaces
{
    public interface IAuthService : IService
    {
        public Task<string> GetAccessTokenAsync(UserDto user);
        public Task<string> GetRefreshTokenAsync(UserDto user);
        public Task<bool> VerifyPasswordAsync(UserDto? userDto, string password);
        public Task<UserDto?> ValidateRefreshTokenAsync(string token);
        public Task<bool> DeleteRefreshTokenAsync(string token);
        public Task<bool> RevokeRefreshTokenAsync(string token);
        public Task<bool> ChangePasswordAsync(UserDto userId, string newPassword);
        public Task<string?> ForgotPasswordAsync(string email);
        public Task<bool> ResetPasswordAsync(string token, string newPassword);
    }
}
