﻿using AutoMapper;
using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Service.DTOs.RequestDTOs.CategoryDTO;
using Service.DTOs.ResponseDTOs.CustomerCategoryDTO;
using Service.DTOs.ResponseDTOs.CustomerProductDTO;
using Service.Models;
using Service.Services.AuthService;
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
        private readonly IAuthService _authService;

        public CategoryService(DataContext context, IMapper mapper, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
        }
        public async Task<ServiceResponse<bool>> CreateCategory(AddCategoryDTO newCategory)
        {
            var username = _authService.GetUserName();

            try
            {
                var category = _mapper.Map<Category>(newCategory);
                category.CreatedBy = username;

                _context.Categories.Add(category);
                await _context.SaveChangesAsync();

                return new ServiceResponse<bool>
                {
                    Message = "Category Created"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<PagingParams<List<Category>>>> GetAdminCategories(int page)
        {
            var pageResults = 10f;
            var pageCount = Math.Ceiling(_context.Categories.Where(p => !p.Deleted).Count() / pageResults);
            try
            {
                var categories = await _context.Categories
                   .Where(c => !c.Deleted)
                   .OrderByDescending(p => p.ModifiedAt)
                   .Skip((page - 1) * (int)pageResults)
                   .Take((int)pageResults)
                   .ToListAsync();

                var pagingData = new PagingParams<List<Category>>
                {
                    Result = categories,
                    CurrentPage = page,
                    Pages = (int)pageCount
                };

                return new ServiceResponse<PagingParams<List<Category>>>
                {
                    Data = pagingData,
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<Category>> GetAdminCategory(Guid categoryId)
        {
            try
            {
                var category = await _context.Categories
                   .Where(c => !c.Deleted)
                   .FirstOrDefaultAsync(c => c.Id == categoryId);
                return new ServiceResponse<Category>
                {
                    Data = category
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

                var result = _mapper.Map<List<CustomerCategoryResponseDTO>>(categories);

                return new ServiceResponse<List<CustomerCategoryResponseDTO>>
                {
                    Data = result
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<bool>> SoftDeleteCategory(Guid categoryId)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Id == categoryId);
            if (category == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Category not found"
                };
            }

            var username = _authService.GetUserName();

            try
            {
                category.Deleted = true;
                category.ModifiedAt = DateTime.Now;
                category.ModifiedBy = username;

                await _context.SaveChangesAsync();

                return new ServiceResponse<bool>
                {
                    Message = "Category Deleted"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<bool>> UpdateCategory(Guid categoryId, UpdateCategoryDTO updateCategory)
        {
            var dbCategory = await _context.Categories.FirstOrDefaultAsync(c => c.Id == categoryId);
            if (dbCategory == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Category not found"
                };
            }

            var username = _authService.GetUserName();

            try
            {
                _mapper.Map(updateCategory, dbCategory);
                dbCategory.ModifiedAt = DateTime.Now;
                dbCategory.ModifiedBy = username;

                await _context.SaveChangesAsync();

                return new ServiceResponse<bool>
                {
                    Message = "Category Updated"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<List<CategorySelectResponseDTO>>> GetCategoriesSelect()
        {
            var categories = await _context.Categories
                                    .Where(c => !c.Deleted)
                                    .ToListAsync();
            var result = _mapper.Map<List<CategorySelectResponseDTO>>(categories);

            return new ServiceResponse<List<CategorySelectResponseDTO>> { Data = result };
        }
    }
}
