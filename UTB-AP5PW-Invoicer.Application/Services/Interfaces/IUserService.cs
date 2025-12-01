using UTB_AP5PW_Invoicer.Application.DTOs;

namespace UTB_AP5PW_Invoicer.Application.Services.Interfaces
{
    public interface IUserService : IService
    {
        public Task<UserDto?> GetUserAsync(int userId);
        public Task<UserDto?> GetUserByEmailAsync(string email);
        public Task<int> CreateUserAsync(string email, string fullName, string password);
        public Task<bool> UpdateUserAsync(UserDto user);
        public Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
        public Task<string?> ForgotPasswordAsync(string email);
        public Task<bool> ResetPasswordAsync(string token, string newPassword);
    }
}