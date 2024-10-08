﻿using Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs.RequestDTOs.OrderCounterDTO;
using Service.DTOs.ResponseDTOs.CustomerVoucherDTO;
using Service.DTOs.ResponseDTOs.OrderCounterDTO;
using Service.Models;
using Service.Services.OrderCounterService;
using System.Data;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin,Employee")]
    public class OrderCounterController : ControllerBase
    {
        private readonly IOrderCounterService _service;

        public OrderCounterController(IOrderCounterService service)
        {
            _service = service;
        }
        [HttpGet("search-product/{searchText}")]
        public async Task<ActionResult<ServiceResponse<List<OrderItemResponseDTO>>>> SearchProducts(string searchText)
        {
            var res = await _service.SearchProducts(searchText);
            if (!res.Success)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }
        [HttpGet("search-address/{searchText}")]
        public async Task<ActionResult<ServiceResponse<List<OrderCounterCustomerAddressDTO>>>> SearchCustomerAddressCards(string searchText)
        {
            var res = await _service.SearchCustomerAddressCards(searchText);
            if (!res.Success)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }
        [HttpPost("place-order")]
        public async Task<ActionResult<ServiceResponse<bool>>> PlaceOrderCounter([FromQuery] Guid? voucherId, PlaceOrderCounterDTO newOrderCounter)
        {
            var res = await _service.PlaceOrderCounter(voucherId, newOrderCounter);
            if (!res.Success)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }
        [HttpGet("select/payment-method")]
        public async Task<ActionResult<ServiceResponse<List<PaymentMethod>>>> GetPaymentMethodSelect()
        {
            var res = await _service.GetPaymentMethodSelect();
            if (!res.Success)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }
        [HttpPost("apply-voucher")]
        public async Task<ActionResult<ServiceResponse<CustomerVoucherResponseDTO>>> ApplyVoucher(string discountCode, int totalAmount)
        {
            var response = await _service.ApplyVoucher(discountCode, totalAmount);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
    }
}
