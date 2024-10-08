﻿using Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs.RequestDTOs.ProductVariantDTO;
using Service.Models;
using Service.Services.ProductVariantService;
using System.Data;

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
        [HttpGet("{productId}")]
        public async Task<ActionResult<ServiceResponse<ProductVariant>>> GetVariant(Guid productId, [FromQuery] Guid productTypeId)
        {
            var response = await _service.GetVartiant(productId, productTypeId);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [Authorize(Roles = "Admin,Employee")]
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
        [Authorize(Roles = "Admin,Employee")]
        [HttpPut("admin/{productId}")]
        public async Task<ActionResult<ServiceResponse<bool>>> UpdateVariant(Guid productId, UpdateProductVariantDTO updateVariant)
        {
            var response = await _service.UpdateVariant(productId, updateVariant);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [Authorize(Roles = "Admin,Employee")]
        [HttpDelete("admin/{productId}")]
        public async Task<ActionResult<ServiceResponse<bool>>> SoftDeleteVariant(Guid productId, [FromQuery] Guid productTypeId)
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
