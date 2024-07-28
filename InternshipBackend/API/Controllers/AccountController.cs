using Data.Entities;
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
        [HttpGet("admin")]
        public async Task<ActionResult<ServiceResponse<PagingParams<List<Account>>>>> GetAdminAccounts([FromQuery] int page)
        {
            if(page == null || page <= 0)
            {
                page = 1;
            }
            var res = await _service.GetAdminAccounts(page);
            if (!res.Success)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }
        [HttpGet("admin/{id}")]
        public async Task<ActionResult<ServiceResponse<Account>>> GetAdminSingleAccount(Guid id)
        {
            var res = await _service.GetAdminSingleAccount(id);
            if (!res.Success)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }
        [HttpGet("admin/role")]
        public async Task<ActionResult<ServiceResponse<List<Role>>>> GetAdminRoles()
        {
            var res = await _service.GetAdminRoles();
            if (!res.Success)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }
        [HttpPost("admin")]
        public async Task<ActionResult<ServiceResponse<bool>>> CreateAccount(CreateAccountDTO newAccount)
        {
            var res = await _service.CreateAccount(newAccount);
            if (!res.Success)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }
        [HttpPut("admin/{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> UpdateAccount(Guid id, UpdateInfoAccountDTO updateAccount)
        {
            var res = await _service.UpdateAccount(id, updateAccount);
            if (!res.Success)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }
        [HttpDelete("admin/{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> SoftDeleteAccount(Guid id)
        {
            var res = await _service.SoftDeleteAccount(id);
            if (!res.Success)
            {
                return BadRequest(res);
            }
            return Ok(res);
        }
    }
}
