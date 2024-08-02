using Service.DTOs.ResponseDTOs.CustomerVoucherDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.VoucherService
{
    public interface IVoucherService
    {
        public Task<ServiceResponse<CustomerVoucherResponseDTO>> GetCustomerVoucher(Guid voucherId);
    }
}
