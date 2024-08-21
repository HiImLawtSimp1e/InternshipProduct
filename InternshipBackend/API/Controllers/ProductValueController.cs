using Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs.RequestDTOs.ProductValueDTO;
using Service.Models;
using Service.Services.ProductValueService;
using System.Data;

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
        public async Task<ActionResult<ServiceResponse<ProductValue>>> GetAttributeValue(Guid productId, [FromQuery] Guid productAttributeId)
        {
            var response = await _service.GetAttributeValue(productId, productAttributeId);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [Authorize(Roles = "Admin,Employee")]
        [HttpPost("admin/{productId}")]
        public async Task<ActionResult<ServiceResponse<bool>>> AddAttributeValue(Guid productId, AddProductValueDTO newValue)
        {
            var response = await _service.AddAttributeValue(productId, newValue);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [Authorize(Roles = "Admin,Employee")]
        [HttpPut("admin/{productId}")]
        public async Task<ActionResult<ServiceResponse<bool>>> UpdateAttributeValue(Guid productId, UpdateProductValueDTO updateValue)
        {
            var response = await _service.UpdateAttributeValue(productId, updateValue);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [Authorize(Roles = "Admin,Employee")]
        [HttpDelete("admin/{productId}")]
        public async Task<ActionResult<ServiceResponse<bool>>> SoftDeleteAttributeValue(Guid productId, [FromQuery] Guid productAttributeId)
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
