using AutoMapper;
using Data.Entities;
using Service.DTOs.RequestDTOs.ProductTypeDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Profiles
{
    public class ProductTypeProfile : Profile
    {
        public ProductTypeProfile() 
        {
            CreateMap<AddProductTypeDTO, ProductType>();
            CreateMap<UpdateProductTypeDTO, ProductType>();
        }
    }
}
