using FluentValidation;

namespace UTB_AP5PW_Invoicer.Application.DTOs.Validators
{
    public class UserDtoValidator : AbstractValidator<UserDto>
    {
        public UserDtoValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress();

            RuleFor(x => x.PasswordHash)
                .NotEmpty();

            RuleFor(x => x.FullName)
                .NotEmpty()
                .MaximumLength(200);
        }
    }
}
