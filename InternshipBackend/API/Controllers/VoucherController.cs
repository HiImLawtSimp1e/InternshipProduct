using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs.ResponseDTOs.CustomerVoucherDTO;
using Service.Models;
using Service.Services.VoucherService;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VoucherController : ControllerBase
    {
        private readonly IVoucherService _service;

        public VoucherController(IVoucherService service)
        {
            _service = service;
        }
        [HttpGet("customer/{id}")]
        public async Task<ActionResult<ServiceResponse<CustomerVoucherResponseDTO>>> GetCustomerVoucher(Guid voucherId)
        {
            var res = await _service.GetCustomerVoucher(voucherId);
            if (!res.Success)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }
    }
}
