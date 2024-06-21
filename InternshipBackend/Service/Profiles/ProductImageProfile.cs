using AutoMapper;
using Data.Entities;
using Service.DTOs.RequestDTOs.ProductImageDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Profiles
{
    public class ProductImageProfile : Profile
    {
        public ProductImageProfile() 
        {
            CreateMap<AddProductImageDTO, ProductImage>();
            CreateMap<UpdateProductImageDTO, ProductImage>();
        }
    }
}
