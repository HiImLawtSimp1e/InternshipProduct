using Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs.RequestDTOs.CustomerDTO;
using Service.Models;
using Service.Services.CustomerService;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _service;

        public CustomerController(ICustomerService service)
        {
            _service = service;
        }
        [HttpGet]
        public async Task<ActionResult<ServiceResponse<Customer>>> GetInfoCustomer()
        {
            var res = await _service.GetInfoCustomer();
            if(!res.Success)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }
        [HttpPost]
        public async Task<ActionResult<ServiceResponse<Customer>>> AddOrUpdateInfoCustomer(UpdateCustomerDTO customer)
        {
            var res = await _service.AddOrUpdateInfoCustomer(customer);
            if (!res.Success)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }
    }
}
