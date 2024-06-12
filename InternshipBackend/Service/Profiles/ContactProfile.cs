using AutoMapper;
using Data.Entities;
using Service.DTOs.RequestDTOs.ContactDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Profiles
{
    public class ContactProfile : Profile
    {
        public ContactProfile()
        {
            CreateMap<SendContactDTO, Contact>();
        }
    }
}
