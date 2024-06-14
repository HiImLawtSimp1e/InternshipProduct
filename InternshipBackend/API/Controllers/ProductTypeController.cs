using Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs.RequestDTOs.ProductTypeDTO;
using Service.Models;
using Service.Services.ProductTypeService;
using System.Data;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductTypeController : ControllerBase
    {
        private readonly IProductTypeService _service;

        public ProductTypeController(IProductTypeService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<ServiceResponse<PagingParams<List<ProductType>>>>> GetProductTypes([FromQuery] int page)
        {
            if(page == null || page <= 0)
            {
                page = 1;
            }
            var response = await _service.GetProductTypes(page);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResponse<List<ProductType>>>> GetProductType(Guid id)
        {
            var response = await _service.GetProductType(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpPost("admin")]
        public async Task<ActionResult<ServiceResponse<bool>>> AddProductType(AddProductTypeDTO productType)
        {
            var response = await _service.CreateProductType(productType);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpPut("admin/{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> UpdateProductType(Guid id, UpdateProductTypeDTO productType)
        {
            var response = await _service.UpdateProductType(id, productType);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpDelete("admin/{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> DeleteProductType(Guid id)
        {
            var response = await _service.DeleteProductType(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpGet("select/{productId}")]
        public async Task<ActionResult<ServiceResponse<List<ProductType>>>> GetSelectProductTypes(Guid productId)
        {
            var response = await _service.GetProductTypeSelect(productId);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
    }
}
