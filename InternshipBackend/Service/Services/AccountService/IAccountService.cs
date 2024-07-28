using Data.Entities;
using Service.DTOs.RequestDTOs.AccountDTO;
using Service.DTOs.ResponseDTOs.AccountDTO;
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

        #region ManageAccountService
        Task<ServiceResponse<PagingParams<List<AccountListResponseDTO>>>> GetAdminAccounts(int page);
        Task<ServiceResponse<AccountResponseDTO>> GetAdminSingleAccount(Guid accountId);
        Task<ServiceResponse<List<Role>>> GetAdminRoles();
        Task<ServiceResponse<bool>> CreateAccount(CreateAccountDTO newAccount);
        Task<ServiceResponse<bool>> UpdateAccount(Guid accountId, UpdateInfoAccountDTO updateInfoAccount);
        Task<ServiceResponse<bool>> SoftDeleteAccount(Guid accountId);
        #endregion ManageAccountSerivce
    }
}
