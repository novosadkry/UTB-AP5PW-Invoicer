using FluentValidation;

namespace UTB_AP5PW_Invoicer.Application.DTOs.Validators
{
    public class PaymentDtoValidator : AbstractValidator<PaymentDto>
    {
        public PaymentDtoValidator()
        {
            RuleFor(x => x.InvoiceId)
                .GreaterThan(0);

            RuleFor(x => x.Amount)
                .GreaterThan(0);

            RuleFor(x => x.PaymentDate)
                .NotEmpty();

            RuleFor(x => x.PaymentMethod)
                .NotEmpty()
                .MaximumLength(100);
        }
    }
}
