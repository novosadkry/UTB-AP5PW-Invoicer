using FluentValidation;

namespace UTB_AP5PW_Invoicer.Application.DTOs.Validators
{
    public class InvoiceItemDtoValidator : AbstractValidator<InvoiceItemDto>
    {
        public InvoiceItemDtoValidator()
        {
            RuleFor(x => x.Description)
                .NotEmpty()
                .MaximumLength(500);

            RuleFor(x => x.UnitPrice)
                .GreaterThanOrEqualTo(0);

            RuleFor(x => x.Quantity)
                .GreaterThan(0);

            RuleFor(x => x.VatAmount)
                .GreaterThanOrEqualTo(0);

            RuleFor(x => x.LineTotal)
                .GreaterThanOrEqualTo(0);
        }
    }
}
