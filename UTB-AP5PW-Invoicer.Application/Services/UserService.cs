using AutoMapper;
using MediatR;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Features.Users.Commands.Create;
using UTB_AP5PW_Invoicer.Application.Features.Users.Queries.Get;

namespace UTB_AP5PW_Invoicer.Application.Services
{
    public interface IUserService : IService
    {
        public Task<UserDto?> GetUserAsync(int userId);
        public Task<UserDto?> GetUserByEmailAsync(string email);
        public Task<bool> VerifyPasswordAsync(UserDto? userDto, string password);
        public Task<int> CreateUserAsync(string email, string fullName, string password);
    }

    public class UserService : IUserService
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;

        public UserService(IMediator mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        public Task<UserDto?> GetUserAsync(int userId)
        {
            return _mediator.Send(new GetUserQuery(userId));
        }

        public Task<UserDto?> GetUserByEmailAsync(string email)
        {
            return _mediator.Send(new GetUserByEmailQuery(email));
        }

        public Task<bool> VerifyPasswordAsync(UserDto? user, string password)
        {
            return Task.FromResult(
                user?.PasswordHash != null &&
                BCrypt.Net.BCrypt.Verify(password, user.PasswordHash));
        }

        public Task<int> CreateUserAsync(string email, string fullName, string password)
        {
            var command = new CreateUserCommand
            {
                Email = email,
                FullName = fullName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password)
            };

            return _mediator.Send(command);
        }
    }
}
