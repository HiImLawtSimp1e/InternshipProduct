using Data.Entities;
using Data.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs.ResponseDTOs.OrerDetailDTO;
using Service.Models;
using Service.Services.OrderService;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _service;

        public OrderController(IOrderService service)
        {
            _service = service;
        }
        [HttpGet("admin")]
        public async Task<ActionResult<ServiceResponse<PagingParams<List<Order>>>>> GetAdminOrders([FromQuery] int page)
        {
            if (page == null || page <= 0)
            {
                page = 1;
            }
            var response = await _service.GetAdminOrders(page);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpGet("admin/{orderId}")]
        public async Task<ActionResult<ServiceResponse<List<OrderItemDTO>>>> GetAdminOrderItems(Guid orderId)
        {
            var response = await _service.GetAdminOrderItems(orderId);
            if(!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpGet("admin/customer/{orderId}")]
        public async Task<ActionResult<ServiceResponse<OrderDetailCustomerDTO>>> GetAdminOrderCustomerInfo(Guid orderId) 
        {
            var response = await _service.GetAdminOrderCustomerInfo(orderId);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpGet("admin/get-state/{orderId}")]
        public async Task<ActionResult<ServiceResponse<int>>> GetOrderState(Guid orderId)
        {
            var response = await _service.GetOrderState(orderId);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }

        [HttpPost("place-order")]
        public async Task<ActionResult<ServiceResponse<bool>>> PlaceOrder()
        {
            var mockAccountId = new Guid("2B25A754-A50E-4468-942C-D65C0BC2C86F");
            var response = await _service.PlaceOrder(mockAccountId);
            if(!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpPut("admin/{orderId}")]
        public async Task<ActionResult<ServiceResponse<bool>>> UpdateOrderState(Guid orderId, OrderState state)
        {
            var response = await _service.UpdateOrderState(orderId, state);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
    }
}
