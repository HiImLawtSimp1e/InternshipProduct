using AutoMapper;
using Data.Entities;
using Service.DTOs.RequestDTOs.StoreCartDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Profiles
{
    public class CartProfile : Profile
    {
        public CartProfile() 
        {
            //Map DTOs to Entity
            CreateMap<StoreCartItemDTO, CartItem>()
                .ForMember(dest => dest.CartId, opt => opt.Ignore());
        }
    }
}
