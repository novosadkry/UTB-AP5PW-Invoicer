using FluentValidation;

namespace UTB_AP5PW_Invoicer.Application.DTOs.Validators
{
    public class RefreshTokenDtoValidator : AbstractValidator<RefreshTokenDto>
    {
        public RefreshTokenDtoValidator()
        {
            RuleFor(x => x.UserId)
                .GreaterThan(0);

            RuleFor(x => x.Token)
                .NotEmpty();

            RuleFor(x => x.ExpiresAt)
                .GreaterThan(DateTime.UtcNow);
        }
    }
}
