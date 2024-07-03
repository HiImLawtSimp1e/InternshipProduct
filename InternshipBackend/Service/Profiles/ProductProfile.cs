using AutoMapper;
using Data.Entities;
using Service.DTOs.RequestDTOs.ProductDTO;
using Service.DTOs.ResponseDTOs.CustomerProductDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Profiles
{
    public class ProductProfile : Profile
    {
        public ProductProfile() 
        {
            // Map Product list(Entity) to customer product list(DTO)
            CreateMap<Product, CustomerProductResponseDTO>();
            CreateMap<ProductVariant, ProductVariantDTO>();
            CreateMap<ProductType, ProductTypeDTO>();
            CreateMap<ProductValue, ProductValueDTO>();
            CreateMap<ProductAttribute, ProductAttributeDTO>();
            // Map DTO to entity
            CreateMap<AddProductDTO, Product>();
            CreateMap<UpdateProductDTO, Product>();
        }
    }
}
