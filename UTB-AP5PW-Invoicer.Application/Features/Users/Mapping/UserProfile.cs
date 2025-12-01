using AutoMapper;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Features.Users.Commands.Create;
using UTB_AP5PW_Invoicer.Application.Features.Users.Commands.Update;
using UTB_AP5PW_Invoicer.Domain.Entities;

namespace UTB_AP5PW_Invoicer.Application.Features.Users.Mapping
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<CreateUserCommand, User>();
            CreateMap<UserDto, CreateUserCommand>();
            CreateMap<UserDto, UpdateUserCommand>();
        }
    }
}
