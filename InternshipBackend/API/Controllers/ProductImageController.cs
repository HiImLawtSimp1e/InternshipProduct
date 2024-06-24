using Data.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs.RequestDTOs.ProductImageDTO;
using Service.Models;
using Service.Services.ProductImageService;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductImageController : ControllerBase
    {
        private readonly IProductImageService _service;

        public ProductImageController(IProductImageService service)
        {
            _service = service;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductImage>> GetProductImage(Guid id)
        {
            var res = await _service.GetProductImage(id);
            if (!res.Success)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }
        [HttpPost("admin")]
        public async Task<ActionResult<ServiceResponse<bool>>> CreateProductImage(AddProductImageDTO newImage)
        {
            var res = await _service.CreateProductImage(newImage);
            if (!res.Success)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }
        [HttpPut("admin/{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> UpdateProductImage(Guid id, UpdateProductImageDTO updateImage)
        {
            var res = await _service.UpdateProductImage(id, updateImage);
            if(!res.Success)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }
        [HttpDelete("admin/{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> DeleteProductImage(Guid id)
        {
            var res = await _service.DeleteProductImage(id);
            if (!res.Success)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }
    }
}
