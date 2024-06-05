using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs.RequestDTOs.AccountDTO;
using Service.Models;
using Service.Services.AccountService;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _service;

        public AccountController(IAccountService service)
        {
            _service = service;
        }
        [HttpPost("register")]
        public async Task<ActionResult<ServiceResponse<int>>> Register(RegisterDTO req)
        { 
            var res = await _service.Register(req);
            if (!res.Success)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }
        [HttpPost("login")]
        public async Task<ActionResult<ServiceResponse<string>>> Login(LoginDTO req)
        {
            var res = await _service.Login(req);
            if (!res.Success)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }
    }
}
