using AutoMapper;
using Data.Entities;
using Service.DTOs.RequestDTOs.CustomerDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Profiles
{
    public class CustomerProfile : Profile
    {
        public CustomerProfile() 
        {
            CreateMap<CustomerDTO, Customer>();
        }
    }
}
