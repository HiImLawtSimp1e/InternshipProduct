using AutoMapper;
using Data.Entities;
using Service.DTOs.RequestDTOs.ProductValueDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Profiles
{
    public class ProductValueProfile : Profile
    {
        public ProductValueProfile() 
        {
            CreateMap<AddProductValueDTO, ProductValue>();
            CreateMap<UpdateProductValueDTO, ProductValue>();
        }
    }
}
