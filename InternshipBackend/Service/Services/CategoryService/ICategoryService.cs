using Data.Entities;
using Service.DTOs.RequestDTOs.CategoryDTO;
using Service.DTOs.ResponseDTOs.CustomerCategoryDTO;
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
        Task<ServiceResponse<PagingParams<List<CustomerCategoryResponseDTO>>>> GetCategoriesAsync(int page);
        Task<ServiceResponse<PagingParams<List<Category>>>> GetAdminCategories(int page);
        Task<ServiceResponse<Category>> GetAdminCategory(Guid categoryId);
        Task<ServiceResponse<bool>> CreateCategory(AddCategoryDTO newCategory);
        Task<ServiceResponse<bool>> UpdateCategory(Guid categoryId, UpdateCategoryDTO category);
        Task<ServiceResponse<bool>> SoftDeleteCategory(Guid categoryId);
        Task<ServiceResponse<List<CategorySelectResponseDTO>>> GetCategoriesSelect();

    }
}
