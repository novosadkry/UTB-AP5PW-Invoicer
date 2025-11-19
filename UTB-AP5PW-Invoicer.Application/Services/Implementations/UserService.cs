using AutoMapper;
using MediatR;
using FluentValidation;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Features.Users.Commands.Create;
using UTB_AP5PW_Invoicer.Application.Features.Users.Queries.Get;
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

        public async Task<int> CreateUserAsync(string email, string fullName, string password)
        {
            var userDto = new UserDto
            {
                Email = email,
                FullName = fullName,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password)
            };

            await _userValidator.ValidateAndThrowAsync(userDto);

            var command = new CreateUserCommand
            {
                Email = userDto.Email,
                FullName = userDto.FullName,
                PasswordHash = userDto.PasswordHash
            };

            return await _mediator.Send(command);
        }
    }
}
