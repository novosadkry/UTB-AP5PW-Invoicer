using AutoMapper;
using MediatR;
using FluentValidation;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Features.Users.Commands.Create;
using UTB_AP5PW_Invoicer.Application.Features.Users.Commands.Update;
using UTB_AP5PW_Invoicer.Application.Features.Users.Commands.Delete;
using UTB_AP5PW_Invoicer.Application.Features.Users.Queries.Get;
using UTB_AP5PW_Invoicer.Application.Features.Users.Queries.List;
using UTB_AP5PW_Invoicer.Application.Services.Interfaces;

namespace UTB_AP5PW_Invoicer.Application.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        private readonly IValidator<UserDto> _userValidator;

        public UserService(IMediator mediator, IMapper mapper, IValidator<UserDto> userValidator)
        {
            _mediator = mediator;
            _mapper = mapper;
            _userValidator = userValidator;
        }

        public Task<UserDto?> GetUserAsync(int userId)
        {
            return _mediator.Send(new GetUserQuery(userId));
        }

        public Task<UserDto?> GetUserByEmailAsync(string email)
        {
            return _mediator.Send(new GetUserByEmailQuery(email));
        }

        public Task<ICollection<UserDto>> ListUsersAsync()
        {
            return _mediator.Send(new ListUsersQuery());
        }

        public async Task<int> CreateUserAsync(string email, string fullName, string password)
        {
            var userDto = new UserDto
            {
                Email = email,
                FullName = fullName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password)
            };

            await _userValidator.ValidateAndThrowAsync(userDto);
            return await _mediator.Send(_mapper.Map<CreateUserCommand>(userDto));
        }

        public async Task<bool> UpdateUserAsync(UserDto user)
        {
            return await _mediator.Send(_mapper.Map<UpdateUserCommand>(user));
        }

        public Task<bool> DeleteUserAsync(int userId)
        {
            return _mediator.Send(new DeleteUserCommand(userId));
        }
    }
}
