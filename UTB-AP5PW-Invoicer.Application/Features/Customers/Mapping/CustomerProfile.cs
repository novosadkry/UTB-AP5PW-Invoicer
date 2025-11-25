using AutoMapper;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Features.Customers.Commands.Create;
using UTB_AP5PW_Invoicer.Application.Features.Customers.Commands.Update;
using UTB_AP5PW_Invoicer.Domain.Entities;

namespace UTB_AP5PW_Invoicer.Application.Features.Customers.Mapping
{
    public class CustomerProfile : Profile
    {
        public CustomerProfile()
        {
            CreateMap<Customer, CustomerDto>().ReverseMap();
            CreateMap<CreateCustomerCommand, Customer>();
            CreateMap<UpdateCustomerCommand, Customer>();
            CreateMap<CustomerDto, CreateCustomerCommand>();
            CreateMap<CustomerDto, UpdateCustomerCommand>();
        }
    }
}
