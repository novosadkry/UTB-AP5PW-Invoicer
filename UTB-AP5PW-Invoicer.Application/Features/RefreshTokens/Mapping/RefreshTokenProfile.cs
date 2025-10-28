using AutoMapper;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Features.RefreshTokens.Commands.Create;
using UTB_AP5PW_Invoicer.Infrastructure.Authentication;

namespace UTB_AP5PW_Invoicer.Application.Features.RefreshTokens.Mapping
{
    public class RefreshTokenProfile : Profile
    {
        public RefreshTokenProfile()
        {
            CreateMap<RefreshToken, RefreshTokenDto>().ReverseMap();
            CreateMap<CreateRefreshTokenCommand, RefreshToken>();
            CreateMap<RefreshTokenDto, CreateRefreshTokenCommand>();
        }
    }
}
