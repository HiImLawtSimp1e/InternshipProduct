using Data.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs.RequestDTOs.ProductValueDTO;
using Service.Models;
using Service.Services.ProductValueService;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductValueController : ControllerBase
    {
        private readonly IProductValueService _service;

        public ProductValueController(IProductValueService service)
        {
            _service = service;
        }
        [HttpGet("{productId}")]
        public async Task<ActionResult<ServiceResponse<ProductValue>>> Get(Guid productId, [FromQuery] Guid productAttributeId)
        {
            var response = await _service.GetAttributeValue(productId, productAttributeId);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpPost("admin/{productId}")]
        public async Task<ActionResult<ServiceResponse<bool>>> AddVariant(Guid productId, AddProductValueDTO newValue)
        {
            var response = await _service.AddAttributeValue(productId, newValue);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpPut("admin/{productId}")]
        public async Task<ActionResult<ServiceResponse<bool>>> UpdateVariant(Guid productId, UpdateProductValueDTO updateValue)
        {
            var response = await _service.UpdateAttributeValue(productId, updateValue);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpDelete("admin/{productId}")]
        public async Task<ActionResult<ServiceResponse<bool>>> SoftDeleteVariant(Guid productId, [FromQuery] Guid productAttributeId)
        {
            var response = await _service.SoftDeleteAttributeValue(productId, productAttributeId);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
    }
}
