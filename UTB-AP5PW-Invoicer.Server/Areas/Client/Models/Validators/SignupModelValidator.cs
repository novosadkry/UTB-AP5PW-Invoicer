using FluentValidation;

namespace UTB_AP5PW_Invoicer.Server.Areas.Client.Models.Validators
{
    public class SignupModelValidator : AbstractValidator<SignupModel>
    {
        public SignupModelValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress();

            RuleFor(x => x.Password)
                .NotEmpty()
                .MinimumLength(5);

            RuleFor(x => x.FullName)
                .NotEmpty()
                .MaximumLength(200);
        }
    }
}
