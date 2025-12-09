using AutoMapper;
using MediatR;
using FluentValidation;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Features.InvoiceItems.Queries.List;
using UTB_AP5PW_Invoicer.Application.Features.InvoiceItems.Commands.Create;
using UTB_AP5PW_Invoicer.Application.Features.InvoiceItems.Commands.Update;
using UTB_AP5PW_Invoicer.Application.Features.InvoiceItems.Queries.Get;
using UTB_AP5PW_Invoicer.Application.Features.InvoiceItems.Commands.Delete;
using UTB_AP5PW_Invoicer.Application.Services.Interfaces;

namespace UTB_AP5PW_Invoicer.Application.Services.Implementations
{
    public class InvoiceItemService : IInvoiceItemService
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        private readonly IValidator<InvoiceItemDto> _invoiceItemValidator;

        public InvoiceItemService(IMediator mediator, IMapper mapper, IValidator<InvoiceItemDto> invoiceItemValidator)
        {
            _mediator = mediator;
            _mapper = mapper;
            _invoiceItemValidator = invoiceItemValidator;
        }

        public async Task<ICollection<InvoiceItemDto>> ListInvoiceItemsAsync(InvoiceDto invoice)
        {
            return await _mediator.Send(new ListInvoiceItemsQuery(invoice.Id));
        }

        public async Task<InvoiceItemDto?> GetInvoiceItemByIdAsync(int id)
        {
            return await _mediator.Send(new GetInvoiceItemQuery(id));
        }

        public async Task<int> CreateInvoiceItemAsync(InvoiceItemDto invoiceItem)
        {
            await _invoiceItemValidator.ValidateAndThrowAsync(invoiceItem);
            return await _mediator.Send(_mapper.Map<CreateInvoiceItemCommand>(invoiceItem));
        }

        public async Task<bool> UpdateInvoiceItemAsync(InvoiceItemDto invoiceItem)
        {
            await _invoiceItemValidator.ValidateAndThrowAsync(invoiceItem);
            return await _mediator.Send(_mapper.Map<UpdateInvoiceItemCommand>(invoiceItem));
        }

        public async Task<bool> DeleteInvoiceItemAsync(InvoiceItemDto invoiceItem)
        {
            return await _mediator.Send(_mapper.Map<DeleteInvoiceItemCommand>(invoiceItem));
        }
    }
}
