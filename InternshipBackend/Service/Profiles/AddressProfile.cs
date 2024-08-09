using AutoMapper;
using Data.Entities;
using Service.DTOs.RequestDTOs.AddressDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Profiles
{
    public class AddressProfile : Profile
    {
        public AddressProfile() 
        {
            //Address Manager
            CreateMap<CreateAddressDTO, CustomerAddress>();
            CreateMap<UpdateAddressDTO, CustomerAddress>();
        }
    }
}
