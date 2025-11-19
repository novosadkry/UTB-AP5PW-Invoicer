using FluentValidation;

namespace UTB_AP5PW_Invoicer.Application.DTOs.Validators
{
    public class CustomerDtoValidator : AbstractValidator<CustomerDto>
    {
        public CustomerDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(200);

            RuleFor(x => x.Address)
                .NotEmpty()
                .MaximumLength(500);

            RuleFor(x => x.ContactEmail)
                .NotEmpty()
                .EmailAddress();

            RuleFor(x => x.ContactPhone)
                .NotEmpty()
                .MaximumLength(50);
        }
    }
}
