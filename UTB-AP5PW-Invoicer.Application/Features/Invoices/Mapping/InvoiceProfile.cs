using AutoMapper;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Features.Invoices.Commands.Create;
using UTB_AP5PW_Invoicer.Application.Features.Invoices.Commands.Update;
using UTB_AP5PW_Invoicer.Domain.Entities;

namespace UTB_AP5PW_Invoicer.Application.Features.Invoices.Mapping
{
    public class InvoiceProfile : Profile
    {
        public InvoiceProfile()
        {
            CreateMap<Invoice, InvoiceDto>().ReverseMap();
            CreateMap<CreateInvoiceCommand, Invoice>();
            CreateMap<UpdateInvoiceCommand, Invoice>();
            CreateMap<InvoiceDto, CreateInvoiceCommand>();
            CreateMap<InvoiceDto, UpdateInvoiceCommand>();
        }
    }
}
