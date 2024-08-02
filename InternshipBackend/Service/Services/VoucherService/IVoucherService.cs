using Data.Entities;
using Service.DTOs.RequestDTOs.VoucherDTO;
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
        public Task<ServiceResponse<PagingParams<List<Voucher>>>> GetVouchers(int page, double pageResults);
        public Task<ServiceResponse<Voucher>> GetVoucher(Guid voucherId);
        public Task<ServiceResponse<bool>> CreateVoucher(AddVoucherDTO newVoucher);
        public Task<ServiceResponse<bool>> UpdateVoucher(Guid voucherId, UpdateVoucherDTO updateVoucher);
        public Task<ServiceResponse<bool>> DeleteVoucher(Guid voucherId);
    }
}
