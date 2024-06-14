using AutoMapper;
using Data.Entities;
using Service.DTOs.RequestDTOs.CategoryDTO;
using Service.DTOs.ResponseDTOs.CustomerCategoryDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Service.Profiles
{
    public class CategoryProfile : Profile
    {
        public CategoryProfile()
        {
            CreateMap<Category, CustomerCategoryResponseDTO>();
            CreateMap<AddCategoryDTO, Category>();
        }
    }

}
