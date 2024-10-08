﻿using Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs.RequestDTOs.CategoryDTO;
using Service.DTOs.ResponseDTOs.CustomerCategoryDTO;
using Service.Models;
using Service.Services.CategoryService;
using System.Data;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _service;

        public CategoryController(ICategoryService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResponse<PagingParams<List<CustomerCategoryResponseDTO>>>>> GetCategoriesAsync()
        {
            var response = await _service.GetCategoriesAsync();
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [Authorize(Roles = "Admin,Employee")]
        [HttpGet("admin")]
        public async Task<ActionResult<ServiceResponse<PagingParams<List<Category>>>>> GetAdminCategories([FromQuery] int page)
        {
            if (page == null || page <= 0)
            {
                page = 1;
            }
            var response = await _service.GetAdminCategories(page);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [Authorize(Roles = "Admin,Employee")]
        [HttpGet("admin/{id}")]
        public async Task<ActionResult<ServiceResponse<Category>>> GetAdminCategory(Guid id)
        {
            var response = await _service.GetAdminCategory(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpGet("select")]
        public async Task<ActionResult<ServiceResponse<List<Category>>>> GetCategoriesSelect()
        {
            var response = await _service.GetCategoriesSelect();
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [Authorize(Roles = "Admin,Employee")]
        [HttpPost("admin")]
        public async Task<ActionResult<ServiceResponse<bool>>> CreateCategory(AddCategoryDTO category)
        {
            var response = await _service.CreateCategory(category);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [Authorize(Roles = "Admin,Employee")]
        [HttpPut("admin/{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> UpdateCategory(Guid id,UpdateCategoryDTO category)
        {
            var response = await _service.UpdateCategory(id, category);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [Authorize(Roles = "Admin,Employee")]
        [HttpDelete("admin/{categoryId}")]
        public async Task<ActionResult<ServiceResponse<bool>>> SoftDeleteCategories(Guid categoryId)
        {
            var response = await _service.SoftDeleteCategory(categoryId);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
    }
}
