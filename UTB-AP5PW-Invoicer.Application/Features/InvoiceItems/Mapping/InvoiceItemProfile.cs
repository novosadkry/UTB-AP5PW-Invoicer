using AutoMapper;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Features.InvoiceItems.Commands.Create;
using UTB_AP5PW_Invoicer.Application.Features.InvoiceItems.Commands.Update;
using UTB_AP5PW_Invoicer.Application.Features.InvoiceItems.Commands.Delete;
using UTB_AP5PW_Invoicer.Domain.Entities;

namespace UTB_AP5PW_Invoicer.Application.Features.InvoiceItems.Mapping
{
    public class InvoiceItemProfile : Profile
    {
        public InvoiceItemProfile()
        {
            CreateMap<InvoiceItem, InvoiceItemDto>().ReverseMap();
            CreateMap<CreateInvoiceItemCommand, InvoiceItem>();
            CreateMap<UpdateInvoiceItemCommand, InvoiceItem>();
            CreateMap<InvoiceItemDto, CreateInvoiceItemCommand>();
            CreateMap<InvoiceItemDto, UpdateInvoiceItemCommand>();
            CreateMap<InvoiceItemDto, DeleteInvoiceItemCommand>();
        }
    }
}
