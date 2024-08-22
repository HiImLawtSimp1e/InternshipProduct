using AutoMapper;
using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Service.DTOs.RequestDTOs.VoucherDTO;
using Service.DTOs.ResponseDTOs.CustomerProductDTO;
using Service.Models;
using Service.Services.AuthService;
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
        private readonly IAuthService _authService;

        public VoucherService(DataContext context, IMapper mapper, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
        }

        public async Task<ServiceResponse<PagingParams<List<Voucher>>>> GetVouchers(int page, double pageResults)
        {
            var pageCount = Math.Ceiling(_context.Vouchers.Count() / pageResults); 

            var vouchers = await _context.Vouchers
                   .OrderByDescending(p => p.ModifiedAt)
                   .Skip((page - 1) * (int)pageResults)
                   .Take((int)pageResults)
                   .ToListAsync();

            var pagingData = new PagingParams<List<Voucher>>
            {
                Result = vouchers,
                CurrentPage = page,
                Pages = (int)pageCount,
                PageResults = (int)pageResults
            };

            return new ServiceResponse<PagingParams<List<Voucher>>>
            {
                Data = pagingData
            };
        }
        public async Task<ServiceResponse<Voucher>> GetVoucher(Guid voucherId)
        {
            var voucher = await _context.Vouchers
                                          .FirstOrDefaultAsync(v => v.Id == voucherId);
            if (voucher == null)
            {
                return new ServiceResponse<Voucher>
                {
                    Success = false,
                    Message = "Not found voucher"
                };
            }

            return new ServiceResponse<Voucher>
            {
                Data = voucher
            };
        }

        public async Task<ServiceResponse<bool>> CreateVoucher(AddVoucherDTO newVoucher)
        {
            if (CheckDiscountCodeExisting(newVoucher.Code) == true)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Discount code have already existed"
                };
            }

            if(!newVoucher.IsDiscountPercent && newVoucher.DiscountValue != 0)
            {
                newVoucher.DiscountValue = 0;
            }

            var username = _authService.GetUserName();

            var voucher = _mapper.Map<Voucher>(newVoucher);
            voucher.CreatedBy = username;

            _context.Vouchers.Add(voucher);
            await _context.SaveChangesAsync();

            return new ServiceResponse<bool>
            {
                Data = true
            };
        }

        public async Task<ServiceResponse<bool>> UpdateVoucher(Guid voucherId, UpdateVoucherDTO updateVoucher)
        {
            var dbVoucher = await _context.Vouchers.FirstOrDefaultAsync(v => v.Id == voucherId);

            if(dbVoucher == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Not found voucher"
                };
            }

            if (!updateVoucher.IsDiscountPercent && updateVoucher.MaxDiscountValue != 0)
            {
                updateVoucher.MaxDiscountValue = 0;
            }

            var username = _authService.GetUserName();

            _mapper.Map(updateVoucher, dbVoucher);
            dbVoucher.ModifiedAt = DateTime.Now;
            dbVoucher.ModifiedBy = username;

            await _context.SaveChangesAsync();
            return new ServiceResponse<bool>
            {
                Data = true
            };
        }

        public async Task<ServiceResponse<bool>> DeleteVoucher(Guid voucherId)
        {
            var voucher = await _context.Vouchers.FirstOrDefaultAsync(v => v.Id == voucherId);

            if (voucher == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Not found voucher"
                };
            }

            var existingOrdersVouchers = await _context.Orders
                                                  .Where(o => o.VoucherId == voucherId)
                                                  .ToListAsync();

            if (existingOrdersVouchers.Any())
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Cannot delete voucher because it has associated orders."
                };
            }

            _context.Vouchers.Remove(voucher);
            await _context.SaveChangesAsync();

            return new ServiceResponse<bool>
            {
                 Success = true,
                 Message = "Voucher has deleted!"
            };
            }

        private bool CheckDiscountCodeExisting(string discountCode)
        {
            var existingDiscountCode = _context.Vouchers
                                             .FirstOrDefault(v => v.Code.ToLower() == discountCode.ToLower());
            return existingDiscountCode != null;
        }
    }
}
