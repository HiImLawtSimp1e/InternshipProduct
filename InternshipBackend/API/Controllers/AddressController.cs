using Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Service.DTOs.RequestDTOs.AddressDTO;
using Service.Models;
using Service.Services.AddressService;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Customer")]
    public class AddressController : ControllerBase
    {
        private readonly IAddressService _service;

        public AddressController(IAddressService service)
        {
            _service = service;
        }
        [HttpGet()]
        public async Task<ActionResult<ServiceResponse<PagingParams<List<CustomerAddress>>>>> GetAddresses([FromQuery] int page)
        {
            if (page == null || page <= 0)
            {
                page = 1;
            }
            var response = await _service.GetAddresses(page);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpGet("{addressId}")]
        public async Task<ActionResult<ServiceResponse<CustomerAddress>>> GetSingleAddress(Guid addressId)
        {
            var response = await _service.GetSingleAddress(addressId);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpGet("main")]
        public async Task<ActionResult<ServiceResponse<CustomerAddress>>> GetMainAddress()
        {
            var response = await _service.GetMainAddress();
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpPost()]
        public async Task<ActionResult<ServiceResponse<bool>>> CreateAddress(CreateAddressDTO newAddress)
        {
            var response = await _service.CreateAddress(newAddress);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpPut("{addressId}")]
        public async Task<ActionResult<ServiceResponse<bool>>> UpdateAddress(Guid addressId, UpdateAddressDTO updateAddress)
        {
            var response = await _service.UpdateAddress(addressId, updateAddress);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpDelete("{addressId}")]
        public async Task<ActionResult<ServiceResponse<bool>>> DeleteAddress(Guid addressId)
        {
            var response = await _service.DeleteAddress(addressId);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
    }
}
