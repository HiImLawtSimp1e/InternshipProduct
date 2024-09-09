using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.Models;
using Service.Services.VnPayService;
using Untils.VnPay;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;

        public PaymentController(IVnPayService vnPayService)
        {
            _vnPayService = vnPayService;
        }

        [Authorize(Roles = "Customer")]
        [HttpPost("vnpay/create-payment")]
        public async Task<IActionResult> CreatePaymentUrl([FromQuery] Guid? voucherId)
        {
            var paymentUrl = _vnPayService.CreatePaymentUrl(HttpContext, voucherId);
            return Ok(new { paymentUrl });
        }

        [HttpGet("vnpay/payment-callback")]
        public async Task<IActionResult> PaymentCallback()
        {
            var response = await _vnPayService.PaymentExecute(Request.Query);

            if (!response.Success || response.Data.VnPayResponseCode != "00")
            {
                // Thanh toán thất bại, chuyển hướng về ứng dụng React
                var message = "Lỗi thanh toán VN Pay: " + response.Data?.VnPayResponseCode;
                string redirectUrl = "http://localhost:3000/payment/failure?status=fail&message=" + message;
                return Redirect(redirectUrl);
            }

            // Thanh toán thành công, chuyển hướng về ứng dụng React
            string successUrl = "http://localhost:3000/payment/success?status=success&orderId=" + response.Data.OrderId;
            return Redirect(successUrl);
        }
    }
}
