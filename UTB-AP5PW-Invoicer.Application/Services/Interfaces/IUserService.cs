using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Domain.Entities;

namespace UTB_AP5PW_Invoicer.Application.Services.Interfaces
{
    public interface IUserService : IService
    {
        public Task<UserDto?> GetUserAsync(int userId);
        public Task<UserDto?> GetUserByEmailAsync(string email);
        public Task<ICollection<UserDto>> ListUsersAsync();
        public Task<int> CreateUserAsync(string email, string fullName, string password);
        public Task<bool> UpdateUserAsync(UserDto user);
        public Task<bool> DeleteUserAsync(int userId);
        public Task<bool> ChangeUserRoleAsync(int userId, UserRole role);
    }
}
