using Data.Entities;
using Service.DTOs.RequestDTOs.CategoryDTO;
using Service.DTOs.ResponseDTOs;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.CategoryService
{
    public interface ICategoryService
    {
        Task<ServiceResponse<List<CustomerCategoryResponseDTO>>> GetCategoriesAsync();
        Task<ServiceResponse<List<Category>>> GetAdminCategories();
        Task<ServiceResponse<List<Category>>> CreateCategory(AddCategoryDTO newCategory);
        Task<ServiceResponse<List<Category>>> UpdateCategory(UpdateCategoryDTO category);
        Task<ServiceResponse<List<Category>>> SoftDeleteCategory(Guid categoryId);

    }
}
