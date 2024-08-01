using Data.Entities;
using Data.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs.ResponseDTOs.OrerDetailDTO;
using Service.Models;
using Service.Services.OrderService;
using System.Data;

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
        [Authorize(Roles = "Customer")]
        [HttpGet()]
        public async Task<ActionResult<ServiceResponse<PagingParams<List<Order>>>>> GetCustomerOrders([FromQuery] int page)
        {
            if (page == null || page <= 0)
            {
                page = 1;
            }
            var response = await _service.GetCustomerOrders(page);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [Authorize(Roles = "Customer")]
        [HttpPost("place-order")]
        public async Task<ActionResult<ServiceResponse<bool>>> PlaceOrder()
        {
            var response = await _service.PlaceOrder();
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
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
        [HttpGet("{orderId}")]
        public async Task<ActionResult<ServiceResponse<List<OrderItemDTO>>>> GetOrderItems(Guid orderId)
        {
            var response = await _service.GetOrderItems(orderId);
            if(!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpGet("customer/{orderId}")]
        public async Task<ActionResult<ServiceResponse<OrderDetailCustomerDTO>>> GetOrderCustomerInfo(Guid orderId) 
        {
            var response = await _service.GetOrderCustomerInfo(orderId);
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
