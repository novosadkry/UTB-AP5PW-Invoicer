using FluentValidation;

namespace UTB_AP5PW_Invoicer.Server.Areas.Client.Models.Validators
{
    public class UpdateProfileModelValidator : AbstractValidator<UpdateProfileModel>
    {
        public UpdateProfileModelValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty()
                .EmailAddress();

            RuleFor(x => x.FullName)
                .NotEmpty()
                .MaximumLength(200);
        }
    }
}
