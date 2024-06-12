using Data.Entities;
using Service.DTOs.RequestDTOs.AccountDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.AccountService
{
    public interface IAccountService
    {
        Task<ServiceResponse<int>> Register(RegisterDTO registerDTO);
        Task<ServiceResponse<string>> Login(LoginDTO loginDTO);
        Task<ServiceResponse<bool>> ChangePassword(Guid accountId, string newPassword);
    }
}
