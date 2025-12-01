using AutoMapper;
using FluentValidation;
using MediatR;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Features.Payments.Commands.Create;
using UTB_AP5PW_Invoicer.Application.Features.Payments.Commands.Delete;
using UTB_AP5PW_Invoicer.Application.Features.Payments.Queries.Get;
using UTB_AP5PW_Invoicer.Application.Features.Payments.Queries.List;
using UTB_AP5PW_Invoicer.Application.Services.Interfaces;

namespace UTB_AP5PW_Invoicer.Application.Services.Implementations
{
    public class PaymentService : IPaymentService
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        private readonly IValidator<PaymentDto> _paymentValidator;

        public PaymentService(IMediator mediator, IMapper mapper, IValidator<PaymentDto> paymentValidator)
        {
            _mediator = mediator;
            _mapper = mapper;
            _paymentValidator = paymentValidator;
        }

        public Task<ICollection<PaymentDto>> ListPaymentsAsync(int invoiceId)
        {
            return _mediator.Send(new ListPaymentsQuery(invoiceId));
        }

        public Task<PaymentDto?> GetPaymentByIdAsync(int id)
        {
            return _mediator.Send(new GetPaymentQuery(id));
        }

        public async Task<int> CreatePaymentAsync(PaymentDto payment)
        {
            await _paymentValidator.ValidateAndThrowAsync(payment);
            var command = _mapper.Map<CreatePaymentCommand>(payment);
            return await _mediator.Send(command);
        }

        public async Task<bool> DeletePaymentAsync(int id)
        {
            return await _mediator.Send(new DeletePaymentCommand(id));
        }
    }
}
