using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Service.Models;
using Service.Services.AuthService;
using Service.Services.VnPayService;
using Service.Services.VnPayService.VnPayTransactionService;
using Untils.VnPay;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly IAuthService _authService;
        private readonly IVnPayTransactionService _vnpayTransService;

        public PaymentController(IVnPayService vnPayService, IAuthService authService, IVnPayTransactionService vnpayTransService)
        {
            _vnPayService = vnPayService;
            _authService = authService;
            _vnpayTransService = vnpayTransService;
        }

        [Authorize(Roles = "Customer")]
        [HttpPost("vnpay/create-payment")]
        public async Task<IActionResult> CreatePaymentUrl([FromQuery] Guid? voucherId)
        {
            // Save userId & voucherId to db
            var userId = _authService.GetUserId();
            var trans = await _vnpayTransService.BeginTransaction(userId, voucherId);

            // Call Service: Generate payment url
            var paymentUrl = _vnPayService.CreatePaymentUrl(HttpContext, voucherId, trans);
            return Ok(new { paymentUrl });
        }

        [HttpGet("vnpay/payment-callback")]
        public async Task<IActionResult> PaymentCallback()
        {
            var response = await _vnPayService.PaymentExecute(Request.Query);

            if (!response.Success)
            {
                // excute payment failure, redirect to React app
                var message = response.Message;
                string redirectUrl = "http://localhost:3000/payment/failure?status=fail&message=" + message;
                return Redirect(redirectUrl);
            }

            // Get transaction
            var trans = await _vnpayTransService.GetTransaction(response.Data.TransactionId);

            if (trans == null)
            {
                // Missing transaction, redirect to React app
                var message = "VNPAY transaction is missing or null.";
                string redirectUrl = "http://localhost:3000/payment/failure?status=fail&message=" + message;
                return Redirect(redirectUrl);
            }

            if (response.Data.VnPayResponseCode != "00")
            {
                //rollback transaction
                await _vnpayTransService.RollbackTransaction(response.Data.TransactionId);

                // Vnpayment failure, redirect to React app
                var message = "Lỗi thanh toán VN Pay: " + response.Data?.VnPayResponseCode;
                string redirectUrl = "http://localhost:3000/payment/failure?status=fail&message=" + message;
                return Redirect(redirectUrl);
            }

            //get userId & voucherId from transaction
            var userId = trans.UserId;
            var voucherId = trans.VoucherId;

            // Create VnPay Order
            var vnpayOrder = await _vnPayService.CreateVnpayOrder(userId, voucherId);

            if (!vnpayOrder.Success)
            {
                //rollback transaction
                await _vnpayTransService.RollbackTransaction(response.Data.TransactionId);

                // Create order failed, redirect to React app
                var message = vnpayOrder.Message;
                string redirectUrl = "http://localhost:3000/payment/failure?status=fail&message=" + message;
                return Redirect(redirectUrl);
            }

            // Successfully, Commit transaction
            await _vnpayTransService.CommitTransaction(response.Data.TransactionId);

            // Successfully, redirect to React app
            string successUrl = "http://localhost:3000/payment/success?status=success&orderId=" + response.Data.OrderId;
            return Redirect(successUrl);
        }
    }
}
