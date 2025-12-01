using AutoMapper;
using MediatR;
using FluentValidation;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Features.Invoices.Commands.Create;
using UTB_AP5PW_Invoicer.Application.Features.Invoices.Commands.Delete;
using UTB_AP5PW_Invoicer.Application.Features.Invoices.Commands.Update;
using UTB_AP5PW_Invoicer.Application.Features.Invoices.Commands.GenerateShareToken;
using UTB_AP5PW_Invoicer.Application.Features.Invoices.Queries.Get;
using UTB_AP5PW_Invoicer.Application.Features.Invoices.Queries.GetByShareToken;
using UTB_AP5PW_Invoicer.Application.Features.Invoices.Queries.List;
using UTB_AP5PW_Invoicer.Application.Services.Interfaces;

namespace UTB_AP5PW_Invoicer.Application.Services.Implementations
{
    public class InvoiceService : IInvoiceService
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        private readonly IValidator<InvoiceDto> _invoiceValidator;

        public InvoiceService(IMediator mediator, IMapper mapper, IValidator<InvoiceDto> invoiceValidator)
        {
            _mediator = mediator;
            _mapper = mapper;
            _invoiceValidator = invoiceValidator;
        }

        public async Task<InvoiceDto?> GetInvoiceByIdAsync(int id)
        {
            return await _mediator.Send(new GetInvoiceQuery(id));
        }

        public async Task<InvoiceDto?> GetInvoiceByShareTokenAsync(string token)
        {
            return await _mediator.Send(new GetInvoiceByShareTokenQuery(token));
        }

        public async Task<int> CreateInvoiceAsync(InvoiceDto invoice)
        {
            await _invoiceValidator.ValidateAndThrowAsync(invoice);
            return await _mediator.Send(_mapper.Map<CreateInvoiceCommand>(invoice));
        }

        public async Task<ICollection<InvoiceDto>> ListInvoicesAsync()
        {
            return await _mediator.Send(new ListInvoicesQuery());
        }

        public async Task<bool> DeleteInvoiceAsync(InvoiceDto invoice)
        {
            return await _mediator.Send(new DeleteInvoiceCommand(invoice.Id));
        }

        public async Task<bool> UpdateInvoiceAsync(InvoiceDto invoice)
        {
            await _invoiceValidator.ValidateAndThrowAsync(invoice);
            return await _mediator.Send(_mapper.Map<UpdateInvoiceCommand>(invoice));
        }

        public async Task<string?> GenerateShareTokenAsync(int invoiceId)
        {
            return await _mediator.Send(new GenerateShareTokenCommand(invoiceId));
        }
    }
}
