using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
    }
}
