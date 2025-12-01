using AutoMapper;
using FluentValidation;
using MediatR;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Features.Customers.Commands.Create;
using UTB_AP5PW_Invoicer.Application.Features.Customers.Commands.Delete;
using UTB_AP5PW_Invoicer.Application.Features.Customers.Commands.Update;
using UTB_AP5PW_Invoicer.Application.Features.Customers.Queries.Get;
using UTB_AP5PW_Invoicer.Application.Features.Customers.Queries.List;
using UTB_AP5PW_Invoicer.Application.Services.Interfaces;

namespace UTB_AP5PW_Invoicer.Application.Services.Implementations
{
    public class CustomerService : ICustomerService
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        private readonly IValidator<CustomerDto> _customerValidator;

        public CustomerService(IMediator mediator, IMapper mapper, IValidator<CustomerDto> customerValidator)
        {
            _mediator = mediator;
            _mapper = mapper;
            _customerValidator = customerValidator;
        }

        public async Task<CustomerDto?> GetCustomerByIdAsync(int id)
        {
            return await _mediator.Send(new GetCustomerQuery(id));
        }

        public async Task<int> CreateCustomerAsync(CustomerDto customer)
        {
            await _customerValidator.ValidateAndThrowAsync(customer);
            return await _mediator.Send(_mapper.Map<CreateCustomerCommand>(customer));
        }

        public async Task<ICollection<CustomerDto>> ListCustomersAsync()
        {
            return await _mediator.Send(new ListCustomersQuery());
        }

        public async Task<bool> DeleteCustomerAsync(CustomerDto customer)
        {
            return await _mediator.Send(new DeleteCustomerCommand(customer.Id));
        }

        public async Task<bool> UpdateCustomerAsync(CustomerDto customer)
        {
            await _customerValidator.ValidateAndThrowAsync(customer);
            return await _mediator.Send(_mapper.Map<UpdateCustomerCommand>(customer));
        }
    }
}
