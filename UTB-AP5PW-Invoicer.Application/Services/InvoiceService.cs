using AutoMapper;
using MediatR;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Features.Invoices.Commands.Create;
using UTB_AP5PW_Invoicer.Application.Features.Invoices.Commands.Delete;
using UTB_AP5PW_Invoicer.Application.Features.Invoices.Commands.Update;
using UTB_AP5PW_Invoicer.Application.Features.Invoices.Queries.Get;
using UTB_AP5PW_Invoicer.Application.Features.Invoices.Queries.List;

namespace UTB_AP5PW_Invoicer.Application.Services
{
    public interface IInvoiceService : IService
    {
        public Task<IEnumerable<InvoiceDto>> ListInvoicesAsync();
        public Task<InvoiceDto?> GetInvoiceByIdAsync(int id);
        public Task CreateInvoiceAsync(InvoiceDto invoice);
        public Task UpdateInvoiceAsync(InvoiceDto invoice);
        public Task DeleteInvoiceAsync(InvoiceDto invoice);
    }

    public class InvoiceService : IInvoiceService
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;

        public InvoiceService(IMediator mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        public async Task<InvoiceDto?> GetInvoiceByIdAsync(int id)
        {
            return await _mediator.Send(new GetInvoiceQuery(id));
        }

        public async Task CreateInvoiceAsync(InvoiceDto invoice)
        {
            await _mediator.Send(_mapper.Map<CreateInvoiceCommand>(invoice));
        }

        public async Task<IEnumerable<InvoiceDto>> ListInvoicesAsync()
        {
            return await _mediator.Send(new ListInvoicesQuery());
        }

        public async Task DeleteInvoiceAsync(InvoiceDto invoice)
        {
            await _mediator.Send(new DeleteInvoiceCommand(invoice.Id));
        }

        public async Task UpdateInvoiceAsync(InvoiceDto invoice)
        {
            await _mediator.Send(_mapper.Map<UpdateInvoiceCommand>(invoice));
        }
    }
}
