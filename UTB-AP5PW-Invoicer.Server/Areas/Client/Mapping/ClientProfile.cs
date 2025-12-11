using AutoMapper;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Server.Areas.Client.Models;
using UTB_AP5PW_Invoicer.Server.Areas.Client.ViewModels;

namespace UTB_AP5PW_Invoicer.Server.Areas.Client.Mapping
{
    public class ClientProfile : Profile
    {
        public ClientProfile()
        {
            CreateMap<UserDto, UserViewModel>();
            CreateMap<InvoiceDto, InvoiceViewModel>();
            CreateMap<CustomerDto, CustomerViewModel>();
            CreateMap<PaymentDto, PaymentViewModel>();
            CreateMap<InvoiceItemDto, InvoiceItemViewModel>();
            CreateMap<ReportDto, ReportViewModel>();
            CreateMap<CustomerRevenueDto, CustomerRevenueViewModel>();
            CreateMap<MonthlyRevenueDto, MonthlyRevenueViewModel>();
            CreateMap<DashboardSummaryDto, DashboardSummaryViewModel>();
            CreateMap<InvoiceSummaryDto, InvoiceSummaryViewModel>();
            CreateMap<PaymentSummaryDto, PaymentSummaryViewModel>();

            CreateMap<CreateInvoiceModel, InvoiceDto>();
            CreateMap<UpdateInvoiceModel, InvoiceDto>();
            CreateMap<CreateCustomerModel, CustomerDto>();
            CreateMap<UpdateCustomerModel, CustomerDto>();
            CreateMap<CreatePaymentModel, PaymentDto>();
            CreateMap<CreateInvoiceItemModel, InvoiceItemDto>();
            CreateMap<UpdateInvoiceItemModel, InvoiceItemDto>();
        }
    }
}
