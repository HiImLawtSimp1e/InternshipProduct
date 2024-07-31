using Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs.RequestDTOs.StoreCartDTO;
using Service.DTOs.ResponseDTOs.CustomerCartItemsDTO;
using Service.Models;
using Service.Services.CartService;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Customer")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _service;

        public CartController(ICartService service)
        {
            _service = service;
        }
        [HttpGet]
        public async Task<ActionResult<ServiceResponse<List<CustomerCartItemsDTO>>>> GetCartItems()
        {
            var response = await _service.GetCartItems();
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpPost]
        public async Task<ActionResult<ServiceResponse<bool>>> AddToCart(StoreCartItemDTO item)
        {
            var response = await _service.AddToCart(item);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpPost("store-cart")]
        public async Task<ActionResult<ServiceResponse<bool>>> StoreCartItems(List<StoreCartItemDTO> items)
        {
            var response = await _service.StoreCartItems(items);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpPut]
        public async Task<ActionResult<ServiceResponse<bool>>> UpdateQuantity(StoreCartItemDTO item)
        {
            var response = await _service.UpdateQuantity(item);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpDelete("{productId}")]
        public async Task<ActionResult<ServiceResponse<bool>>> RemoveFromCart(Guid productId, [FromQuery] Guid productTypeId)
        {
            var response = await _service.RemoveFromCart(productId, productTypeId);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
    }
}
