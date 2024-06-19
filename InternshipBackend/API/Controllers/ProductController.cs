using Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Service.DTOs.RequestDTOs.ProductDTO;
using Service.DTOs.ResponseDTOs;
using Service.DTOs.ResponseDTOs.CustomerProductDTO;
using Service.Models;
using Service.Services.ProductService;
using System.Data;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _service;

        public ProductController(IProductService service)
        {
            _service = service;
        }
        [HttpGet]
        public async Task<ActionResult<ServiceResponse<PagingParams<List<CustomerProductResponseDTO>>>>> GetProductsAsync([FromQuery] int page, [FromQuery] double pageResults)
        {
            if (page == null || page <= 0)
            {
                page = 1;
            }
            if(pageResults == null || pageResults <= 0)
            {
                pageResults = 8f;
            }
            var response = await _service.GetProductsAsync(page, pageResults);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpGet("admin")]
        public async Task<ActionResult<ServiceResponse<PagingParams<List<Product>>>>> GetAdminProducts([FromQuery] int page, [FromQuery] double pageResults)
        {
            if(page == null || page <= 0) 
            {
                page = 1;
            }
            if(pageResults == null || pageResults <= 0)
            {
                pageResults = 10f;
            }
            var response = await _service.GetAdminProducts(page, pageResults);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpGet("admin/{id}")]
        public async Task<ActionResult<ServiceResponse<Product>>> GetAdminProduct(Guid id)
        {
            var response = await _service.GetAdminSingleProduct(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpGet("{slug}")]
        public async Task<ActionResult<ServiceResponse<CustomerProductResponseDTO>>> GetProductBySlug(string slug)
        {
            var response = await _service.GetProductBySlug(slug);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpGet("list/{categorySlug}")]
        public async Task<ActionResult<ServiceResponse<CustomerProductResponseDTO>>> GetProductsByCategory(string categorySlug)
        {
            var response = await _service.GetProductsByCategory(categorySlug);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpPost("admin")]
        public async Task<ActionResult<ServiceResponse<bool>>> CreateProduct(AddProductDTO newProduct)
        {
            var response = await _service.CreateProduct(newProduct);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpPut("admin/{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> UpdateProduct(Guid id, UpdateProductDTO product)
        {
            var response = await _service.UpdateProduct(id, product);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpDelete("admin/{productId}")]
        public async Task<ActionResult<ServiceResponse<bool>>> SoftDeleteProduct(Guid productId)
        {
            var response = await _service.SoftDeleteProduct(productId);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpGet("search/{searchText}/{page}")]
        public async Task<ActionResult<ServiceResponse<ProductSearchResult>>> SearchProducts(string searchText, int page)
        {
            var response = await _service.SearchProducts(searchText, page);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpGet("SearchSuggestions/{searchText}")]
        public async Task<ActionResult<ServiceResponse<ProductSearchResult>>> GetProductSearchSuggestions(string searchText)
        {
            var response = await _service.GetProductSearchSuggestions(searchText);
            return Ok(response);
        }
    }
}
