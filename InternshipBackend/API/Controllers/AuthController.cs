using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs.RequestDTOs.AccountDTO;
using Service.Models;
using Service.Services.AuthService;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;

        public AuthController(IAuthService service)
        {
            _service = service;
        }
        [HttpPost("register")]
        public async Task<ActionResult<ServiceResponse<string>>> Register(RegisterDTO req)
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
        [HttpPost("admin/login")]
        public async Task<ActionResult<ServiceResponse<string>>> AdminLogin(LoginDTO req)
        {
            var res = await _service.AdminLogin(req);
            if (!res.Success)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }
        [HttpPost("verify-token")]
        public async Task<ActionResult<ServiceResponse<string>>> VerifyToken(string token)
        {
            var res = await _service.VerifyToken(token);
            if (!res.Success)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }
    }
}
