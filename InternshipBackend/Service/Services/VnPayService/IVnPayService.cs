using Microsoft.AspNetCore.Http;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Untils.VnPay;

namespace Service.Services.VnPayService
{
    public interface IVnPayService
    {
        public Task<string> CreatePaymentUrl(HttpContext context, Guid? voucherId, string transactionId);
        public Task<ServiceResponse<VnPaymentResponseModel>> PaymentExecute(IQueryCollection collections);
        public Task<ServiceResponse<bool>> CreateVnpayOrder(Guid userId, Guid? voucherId);
    }
}
