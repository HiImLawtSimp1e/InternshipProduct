using AutoMapper;
using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Service.DTOs.RequestDTOs.CategoryDTO;
using Service.DTOs.ResponseDTOs;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.CategoryService
{
    public class CategoryService : ICategoryService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public CategoryService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<ServiceResponse<List<Category>>> CreateCategory(AddCategoryDTO newCategory)
        {
            try
            {
                var category = _mapper.Map<Category>(newCategory);
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();
                return await GetAdminCategories();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<List<Category>>> GetAdminCategories()
        {
            try
            {
                var categories = await _context.Categories
                   .Where(c => !c.Deleted)
                   .ToListAsync();
                return new ServiceResponse<List<Category>>
                {
                    Data = categories,
                    Message = "Successfully!!!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<List<CustomerCategoryResponseDTO>>> GetCategoriesAsync()
        {
            try
            {
                var categories = await _context.Categories
                   .Where(c => !c.Deleted && c.IsActive)
                   .ToListAsync();
                var result = categories.Select(category => _mapper.Map<CustomerCategoryResponseDTO>(category)).ToList();
                return new ServiceResponse<List<CustomerCategoryResponseDTO>>
                {
                    Data = result,
                    Message = "Successfully!!!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<List<Category>>> SoftDeleteCategory(Guid categoryId)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == categoryId);
            if (category == null)
            {
                return new ServiceResponse<List<Category>>
                {
                    Success = false,
                    Message = "Category not found"
                };
            }

            try
            {
                category.Deleted = true;
                await _context.SaveChangesAsync();

                return await GetAdminCategories();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<List<Category>>> UpdateCategory(UpdateCategoryDTO category)
        {
            var dbCategory = await _context.Categories.FirstOrDefaultAsync(c => c.Id == category.Id);
            if (dbCategory == null)
            {
                return new ServiceResponse<List<Category>>
                {
                    Success = false,
                    Message = "Category not found"
                };
            }

            try
            {
                dbCategory.Title = category.Title;
                dbCategory.Slug = category.Slug;
                dbCategory.IsActive = category.IsActive;
                dbCategory.ModifiedAt = DateTime.Now;

                await _context.SaveChangesAsync();

                return await GetAdminCategories();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
