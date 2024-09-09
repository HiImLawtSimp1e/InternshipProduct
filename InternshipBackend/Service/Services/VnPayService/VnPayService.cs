using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Untils.VnPay;
using Service.Services.CartService;
using Microsoft.EntityFrameworkCore;
using Service.Services.AuthService;
using Service.Models;
using Service.Services.OrderCommonService;
using Data.Entities;
using Data.Context;
using Service.Services.OrderService;

namespace Service.Services.VnPayService
{
    public class VnPayService : IVnPayService
    {
        private readonly IConfiguration _config;
        private readonly ICartService _cartService;
        private readonly IOrderCommonService _orderCommonService;
        private readonly IOrderService _orderService;
        private readonly IAuthService _authService;

        public VnPayService(IConfiguration config, ICartService cartService, IOrderCommonService orderCommonService, IOrderService orderService, IAuthService authService)
        {
            _config = config;
            _cartService = cartService;
            _orderCommonService = orderCommonService;
            _orderService = orderService;
            _authService = authService;
        }

        public async Task<string> CreatePaymentUrl(HttpContext context, Guid? voucherId)
        {
            var totalAmount = await _cartService.GetCartTotalAmountAsync() + 30000;
            var tick = DateTime.Now.Ticks.ToString();
            var invoiceCode = _orderCommonService.GenerateInvoiceCode();
            var userId = _authService.GetUserId().ToString();

            #region Default vnpay config

            var vnpay = new VnPayLibrary();

            //Vnpay config
            vnpay.AddRequestData("vnp_Version", _config["VnPay:Version"]);
            vnpay.AddRequestData("vnp_Command", _config["VnPay:Command"]);
            vnpay.AddRequestData("vnp_TmnCode", _config["VnPay:TmnCode"]);

            //Order Information
            //Số tiền thanh toán. Số tiền không mang các ký tự phân tách thập phân, phần nghìn, ký tự tiền tệ. Để gửi số tiền thanh toán là 100,000 VND (một trăm nghìn VNĐ) thì merchant cần nhân thêm 100 lần (khử phần thập phân), sau đó gửi sang VNPAY
            vnpay.AddRequestData("vnp_Amount", (totalAmount * 100).ToString());  
            vnpay.AddRequestData("vnp_CurrCode", _config["VnPay:CurrCode"]);
            vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_OrderInfo", invoiceCode);
            vnpay.AddRequestData("vnp_OrderType", "other"); //default value: other

            //IpAddress
            vnpay.AddRequestData("vnp_IpAddr", GetIpAddress(context));
            vnpay.AddRequestData("vnp_Locale", _config["VnPay:Locale"]);

            //Return Url
            vnpay.AddRequestData("vnp_ReturnUrl", _config["VnPay:PaymentBackReturnUrl"]);

            // Mã tham chiếu của giao dịch tại hệ thống của merchant. Mã này là duy nhất dùng để phân biệt các đơn hàng gửi sang VNPAY. Không được trùng lặp trong ngày
            vnpay.AddRequestData("vnp_TxnRef", tick);

            #endregion Default vnpay config

            // Add userId to request data
            vnpay.AddRequestData("vnp_userId", userId);

            // Add voucherId to request data
            if (voucherId.HasValue)
            {
                vnpay.AddRequestData("vnp_VoucherId", voucherId.Value.ToString());
            }

            var paymentUrl = vnpay.CreateRequestUrl(_config["VnPay:BaseUrl"], _config["VnPay:HashSecret"]);

            return paymentUrl;
        }

        public async Task<ServiceResponse<VnPaymentResponseModel>> PaymentExecute(IQueryCollection collections)
        {
            var vnpay = new VnPayLibrary();
            foreach (var (key, value) in collections)
            {
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    vnpay.AddResponseData(key, value.ToString());
                }
            }

            var vnp_TransactionId = Convert.ToInt64(vnpay.GetResponseData("vnp_TransactionNo"));
            var vnp_SecureHash = collections.FirstOrDefault(p => p.Key == "vnp_SecureHash").Value;
            var vnp_ResponseCode = vnpay.GetResponseData("vnp_ResponseCode");
            var vnp_OrderInfo = vnpay.GetResponseData("vnp_OrderInfo");

            bool checkSignature = vnpay.ValidateSignature(vnp_SecureHash, _config["VnPay:HashSecret"]);
            if (!checkSignature)
            {
                return new ServiceResponse<VnPaymentResponseModel>
                {
                    Success = false,
                    Message = "Signature is not valid"
                };
            }

            // Retrieve userId from response if present
            var vnp_UserId = vnpay.GetResponseData("vnp_userId");

            if (string.IsNullOrEmpty(vnp_UserId))
            {
                return new ServiceResponse<VnPaymentResponseModel>
                {
                    Success = false,
                    Message = "Missing user id"
                };
            }

            var userId = new Guid(vnp_UserId);

            // Retrieve voucherId from response if present
            var vnp_VoucherId = vnpay.GetResponseData("vnp_VoucherId");
            Guid? voucherId = null;

            if (!string.IsNullOrEmpty(vnp_VoucherId))
            {
                voucherId = new Guid(vnp_VoucherId);
            }

            //call order service to create new order
            var vnpayOrder = await CreateVnpayOrder(userId, voucherId);

            if (!vnpayOrder.Success)
            {
                return new ServiceResponse<VnPaymentResponseModel>
                {
                    Success = false,
                    Message = vnpayOrder.Message
                };
            }

            var result = new VnPaymentResponseModel
            {
                Success = true,
                PaymentMethod = "VnPay",
                OrderDescription = vnp_OrderInfo,
                OrderId = vnp_OrderInfo,
                TransactionId = vnp_TransactionId.ToString(),
                Token = vnp_SecureHash,
                VnPayResponseCode = vnp_ResponseCode
            };
            return new ServiceResponse<VnPaymentResponseModel>
            {
                Data = result,
            };
        }

        private async Task<ServiceResponse<bool>> CreateVnpayOrder(Guid userId, Guid? voucherId)
        {
            var customer = await _authService.GetCustomerById(userId);

            if (customer == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Missing customer information"
                };
            }

            var createOrder = await _orderService.CreateOrder(voucherId, customer, "E-Wallet (VNPay)");

            if (!createOrder.Success)
            {
                return createOrder;
            }

            return new ServiceResponse<bool>
            {
                Data = true,
                Message = "Place order VNPAY successfully!"
            };
        }

        private string GetIpAddress(HttpContext context)
        {
            var ipAddress = string.Empty;
            try
            {
                var remoteIpAddress = context.Connection.RemoteIpAddress;

                if (remoteIpAddress != null)
                {
                    if (remoteIpAddress.AddressFamily == AddressFamily.InterNetworkV6)
                    {
                        remoteIpAddress = Dns.GetHostEntry(remoteIpAddress).AddressList
                            .FirstOrDefault(x => x.AddressFamily == AddressFamily.InterNetwork);
                    }

                    if (remoteIpAddress != null) ipAddress = remoteIpAddress.ToString();

                    return ipAddress;
                }
            }
            catch (Exception ex)
            {
                return "Invalid IP:" + ex.Message;
            }

            return "127.0.0.1";
        }
    }
}
