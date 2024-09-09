using Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.OrderCommonService
{
    public interface IOrderCommonService
    {
        string GenerateInvoiceCode();
        bool IsVoucherUsed(Guid voucherId, Guid customerId);
        int CalculateDiscountValue(Voucher voucher, int totalAmount);
        Task<int> CalculateDiscountValueWithId(Guid? voucherId, int totalAmount);
    }
}
