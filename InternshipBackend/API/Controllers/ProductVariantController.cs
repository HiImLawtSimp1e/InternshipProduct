using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs.RequestDTOs.ProductVariantDTO;
using Service.Models;
using Service.Services.ProductVariantService;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductVariantController : ControllerBase
    {
        private readonly IProductVariantService _service;

        public ProductVariantController(IProductVariantService service)
        {
            _service = service;
        }
        [HttpPost("admin/{productId}")]
        public async Task<ActionResult<ServiceResponse<bool>>> AddVariant(Guid productId,AddProductVariantDTO newVariant)
        {
            var response = await _service.AddVariant(productId, newVariant);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpPut("admin/{productId}")]
        public async Task<ActionResult<ServiceResponse<bool>>> UpdateProduct(Guid productId, UpdateProductVariantDTO updateVariant)
        {
            var response = await _service.UpdateVariant(productId, updateVariant);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpDelete("admin/{productTypeId}")]
        public async Task<ActionResult<ServiceResponse<bool>>> SoftDeleteProduct(Guid productTypeId, Guid productId)
        {
            var response = await _service.SoftDeleteVariant(productTypeId, productId);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
    }
}
