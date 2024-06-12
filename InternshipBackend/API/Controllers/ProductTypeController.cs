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
        public async Task<ActionResult<ServiceResponse<ProductType>>> GetProductTypes()
        {
            var response = await _service.GetProductTypes();
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpPost("admin"), Authorize(Roles = "Admin")]
        public async Task<ActionResult<ServiceResponse<ProductType>>> AddProductType(AddProductTypeDTO productType)
        {
            var response = await _service.CreateProductType(productType);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpPut("admin"), Authorize(Roles = "Admin")]
        public async Task<ActionResult<ServiceResponse<ProductType>>> UpdateProductType(UpdateProductTypeDTO productType)
        {
            var response = await _service.UpdateProductType(productType);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpGet("select/{productId}")]
        public async Task<ActionResult<ServiceResponse<ProductType>>> GetSelectProductTypes(Guid productId)
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
