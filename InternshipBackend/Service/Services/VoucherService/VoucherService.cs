using AutoMapper;
using Data.Context;
using Microsoft.EntityFrameworkCore;
using Service.DTOs.ResponseDTOs.CustomerVoucherDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.VoucherService
{
    public class VoucherService : IVoucherService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public VoucherService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<ServiceResponse<CustomerVoucherResponseDTO>> GetCustomerVoucher(Guid voucherId)
        {
            var voucher = await _context.Vouchers
                                          .Where(v => v.IsActive == true && DateTime.Now > v.StartDate && DateTime.Now < v.EndDate && v.Quantity > 0)
                                          .FirstOrDefaultAsync(v => v.Id == voucherId);
            if (voucher == null)
            {
                return new ServiceResponse<CustomerVoucherResponseDTO>
                {
                    Success = false,
                    Message = "Discount code is incorrect or has expired"
                };
            }

            var result = _mapper.Map<CustomerVoucherResponseDTO>(voucher);

            return new ServiceResponse<CustomerVoucherResponseDTO>
            {
                Data = result
            };
        }
    }
}
