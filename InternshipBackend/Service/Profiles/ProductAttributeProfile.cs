using AutoMapper;
using Data.Entities;
using Service.DTOs.RequestDTOs.ProductAttributeDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Profiles
{
    public class ProductAttributeProfile : Profile
    {
        public ProductAttributeProfile() 
        {
            CreateMap<AddProductAttributeDTO, ProductAttribute>();
            CreateMap<UpdateProductAttributeDTO, ProductAttribute>();
        }
    }
}
