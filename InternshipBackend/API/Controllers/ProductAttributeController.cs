using Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs.RequestDTOs.ProductAttributeDTO;
using Service.Models;
using Service.Services.ProductAttributeService;
using System.Data;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductAttributeController : ControllerBase
    {
        private readonly IProductAttributeService _service;

        public ProductAttributeController(IProductAttributeService service)
        {
            _service = service;
        }
        [HttpGet]
        public async Task<ActionResult<ServiceResponse<PagingParams<List<ProductAttribute>>>>> GetProductAttributes([FromQuery] int page)
        {
            if (page == null || page <= 0)
            {
                page = 1;
            }
            var response = await _service.GetProductAttributes(page);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<List<ProductAttribute>>>> GetProductAttribute(Guid id)
        {
            var response = await _service.GetProductAttribute(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [Authorize(Roles = "Admin,Employee")]
        [HttpPost("admin")]
        public async Task<ActionResult<ServiceResponse<bool>>> AddProductAttribute(AddProductAttributeDTO productAttribute)
        {
            var response = await _service.CreateProductAttribute(productAttribute);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [Authorize(Roles = "Admin,Employee")]
        [HttpPut("admin/{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> UpdateProductAttribute(Guid id, UpdateProductAttributeDTO productAttribute)
        {
            var response = await _service.UpdateProductAttribute(id, productAttribute);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [Authorize(Roles = "Admin,Employee")]
        [HttpDelete("admin/{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> DeleteProductAttribute(Guid id)
        {
            var response = await _service.DeleteProductAttribute(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpGet("select/{productId}")]
        public async Task<ActionResult<ServiceResponse<List<ProductAttribute>>>> GetSelectProductAttributes(Guid productId)
        {
            var response = await _service.GetProductAttributeSelect(productId);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
    }
}
