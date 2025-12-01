using AutoMapper;
using MediatR;
using FluentValidation;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Features.Users.Commands.Create;
using UTB_AP5PW_Invoicer.Application.Features.Users.Commands.Update;
using UTB_AP5PW_Invoicer.Application.Features.Users.Commands.ChangePassword;
using UTB_AP5PW_Invoicer.Application.Features.Users.Commands.ForgotPassword;
using UTB_AP5PW_Invoicer.Application.Features.Users.Commands.ResetPassword;
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

        public async Task<bool> UpdateUserAsync(UserDto user)
        {
            var command = new UpdateUserCommand
            {
                Id = user.Id,
                Email = user.Email,
                FullName = user.FullName,
                CompanyName = user.CompanyName,
                Ico = user.Ico,
                Dic = user.Dic,
                CompanyAddress = user.CompanyAddress,
                CompanyPhone = user.CompanyPhone
            };

            return await _mediator.Send(command);
        }

        public async Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            var command = new ChangePasswordCommand
            {
                UserId = userId,
                CurrentPassword = currentPassword,
                NewPassword = newPassword
            };

            return await _mediator.Send(command);
        }

        public Task<string?> ForgotPasswordAsync(string email)
        {
            return _mediator.Send(new ForgotPasswordCommand { Email = email });
        }

        public Task<bool> ResetPasswordAsync(string token, string newPassword)
        {
            return _mediator.Send(new ResetPasswordCommand { Token = token, NewPassword = newPassword });
        }
    }
}
