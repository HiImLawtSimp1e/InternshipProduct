using Data.Context;
using Data.Entities;
using Service.Services.AuthService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.OrderCommonService
{
    public class OrderCommonService : IOrderCommonService
    {
        private readonly DataContext _context;

        public OrderCommonService(DataContext context)
        {
            _context = context;
        }

        //Generate random invoice code
        public string GenerateInvoiceCode()
        {
            return $"INV-{DateTime.Now:yyyyMMddHHmmssfff}-{new Random().Next(1000, 9999)}";
        }

        //Logical: Each account is allowed to use one voucher code only once
        public bool IsVoucherUsed(Guid voucherId, Guid customerId)
        {
            var isUsedVoucher = _context.Orders.FirstOrDefault(o => o.CustomerId == customerId && o.VoucherId == voucherId);
            return isUsedVoucher != null;
        }

        // MaxDiscountValue = 0 meaning max discount value doesn't exist
        public int CalculateDiscountValue(Voucher voucher, int totalAmount)
        {
            int result = 0;
            if (voucher.IsDiscountPercent)
            {
                var discountValue = (int)(totalAmount * (voucher.DiscountValue / 100));

                if (voucher.MaxDiscountValue > 0)
                {
                    result = (discountValue > voucher.MaxDiscountValue) ? voucher.MaxDiscountValue : discountValue;
                }
                else
                {
                    result = discountValue;
                }
            }
            else
            {
                result = (int)voucher.DiscountValue;
            }
            return result;
        }
    }
}
