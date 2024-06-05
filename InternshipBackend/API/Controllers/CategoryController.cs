using Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs.RequestDTOs.CategoryDTO;
using Service.DTOs.ResponseDTOs;
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
        public async Task<ActionResult<ServiceResponse<List<CustomerCategoryResponseDTO>>>> GetCategoriesAsync()
        {
            var response = await _service.GetCategoriesAsync();
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpGet("admin"), Authorize(Roles = "Admin")]
        public async Task<ActionResult<ServiceResponse<List<Category>>>> GetAdminCategories()
        {
            var response = await _service.GetAdminCategories();
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpPost("admin"), Authorize(Roles = "Admin")]
        public async Task<ActionResult<ServiceResponse<List<Category>>>> CreateCategory(AddCategoryDTO category)
        {
            var response = await _service.CreateCategory(category);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpPut("admin"), Authorize(Roles = "Admin")]
        public async Task<ActionResult<ServiceResponse<List<Category>>>> UpdateCategory(UpdateCategoryDTO category)
        {
            var response = await _service.UpdateCategory(category);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpDelete("admin/{categoryId}"), Authorize(Roles = "Admin")]
        public async Task<ActionResult<ServiceResponse<List<Category>>>> SoftDeleteCategories(Guid categoryId)
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
