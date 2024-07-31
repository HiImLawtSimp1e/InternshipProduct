using Data.Entities;
using Service.DTOs.RequestDTOs.AccountDTO;
using Service.DTOs.ResponseDTOs.AccountDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.AuthService
{
    public interface IAuthService
    {
        Task<ServiceResponse<string>> Register(RegisterDTO registerDTO);
        Task<ServiceResponse<string>> Login(LoginDTO loginDTO);
        Task<ServiceResponse<string>> AdminLogin(LoginDTO loginDTO);
        Task<ServiceResponse<bool>> ChangePassword(Guid accountId, string newPassword);
        Task<ServiceResponse<string>> VerifyToken(string token);
        Guid GetUserId();
        string GetUserName();
    }
}
