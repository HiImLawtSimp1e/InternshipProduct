using AutoMapper;
using Data.Entities;
using Service.DTOs.RequestDTOs.ProductVariantDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Profiles
{
    public class ProductVariantProfile : Profile
    {
        public ProductVariantProfile() 
        {
            CreateMap<AddProductVariantDTO, ProductVariant>();
            CreateMap<UpdateProductVariantDTO, ProductVariant>();
        }
    }
}
