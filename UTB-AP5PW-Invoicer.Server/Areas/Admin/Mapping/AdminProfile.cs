using AutoMapper;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Server.Areas.Admin.Models;
using UTB_AP5PW_Invoicer.Server.Areas.Admin.ViewModels;

namespace UTB_AP5PW_Invoicer.Server.Areas.Admin.Mapping
{
    public class AdminProfile : Profile
    {
        public AdminProfile()
        {
            CreateMap<UserDto, UserViewModel>();
            CreateMap<InvoiceDto, InvoiceViewModel>();
            CreateMap<CustomerDto, CustomerViewModel>();
            CreateMap<PaymentDto, PaymentViewModel>();
            CreateMap<InvoiceItemDto, InvoiceItemViewModel>();

            CreateMap<CreateInvoiceModel, InvoiceDto>();
            CreateMap<UpdateInvoiceModel, InvoiceDto>();
            CreateMap<CreateCustomerModel, CustomerDto>();
            CreateMap<UpdateCustomerModel, CustomerDto>();
            CreateMap<CreatePaymentModel, PaymentDto>();
            CreateMap<UpdateUserModel, UserDto>();
        }
    }
}
