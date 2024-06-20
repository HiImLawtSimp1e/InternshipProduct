using AutoMapper;
using Data.Entities;
using Service.DTOs.ResponseDTOs.AccountDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Profiles
{
    public class AccountProfile : Profile
    {
        public AccountProfile()
        {
            // Mapping list Account to DTO
            CreateMap<Account, AccountListResponseDTO>();

            // Mapping Account Entity to DTO
            CreateMap<Account, AccountResponseDTO>()
              .ForMember(dest => dest.FullName, opt => opt.Ignore())
              .ForMember(dest => dest.Email, opt => opt.Ignore())
              .ForMember(dest => dest.Phone, opt => opt.Ignore())
              .ForMember(dest => dest.Address, opt => opt.Ignore());

            // Mapping Employee Entity to DTO
            CreateMap<Employee, AccountResponseDTO>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.AccountName, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.Ignore())
                .ForMember(dest => dest.Role, opt => opt.Ignore());

            // Mapping Customer Entity to DTO
            CreateMap<Customer, AccountResponseDTO>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.AccountName, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.Ignore())
                .ForMember(dest => dest.Role, opt => opt.Ignore());
        }
    }
}
