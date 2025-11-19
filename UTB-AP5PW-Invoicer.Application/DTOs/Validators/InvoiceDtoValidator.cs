using FluentValidation;

namespace UTB_AP5PW_Invoicer.Application.DTOs.Validators
{
    public class InvoiceDtoValidator : AbstractValidator<InvoiceDto>
    {
        public InvoiceDtoValidator()
        {
            RuleFor(x => x.InvoiceNumber)
                .NotEmpty()
                .MaximumLength(50);

            RuleFor(x => x.IssueDate)
                .LessThanOrEqualTo(x => x.DueDate);

            RuleFor(x => x.Status)
                .NotEmpty()
                .MaximumLength(50);

            RuleFor(x => x.TotalAmount)
                .GreaterThanOrEqualTo(0);

            RuleFor(x => x.TotalVat)
                .GreaterThanOrEqualTo(0);
        }
    }
}
