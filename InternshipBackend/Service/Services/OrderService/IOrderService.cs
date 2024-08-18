using Data.Entities;
using Data.Enums;
using Service.DTOs.ResponseDTOs.CustomerVoucherDTO;
using Service.DTOs.ResponseDTOs.OrerDetailDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.OrderService
{
    public interface IOrderService
    {
        #region Customer'sOrderService
        public Task<ServiceResponse<bool>> PlaceOrder(Guid? voucherId);
        public Task<ServiceResponse<CustomerVoucherResponseDTO>> ApplyVoucher(string discountCode);
        public Task<ServiceResponse<bool>> CancelOrder(Guid orderId);
        public Task<ServiceResponse<PagingParams<List<Order>>>> GetCustomerOrders(int page);
        #endregion Customer'sOrderService

        #region GetOrdersInformation
        public Task<ServiceResponse<PagingParams<List<Order>>>> GetAdminOrders(int page);
        public Task<ServiceResponse<List<OrderItemDTO>>> GetOrderItems(Guid orderId);
        public Task<ServiceResponse<OrderDetailCustomerDTO>> GetOrderDetailInfo(Guid orderId);
        #endregion GetOrdersInformation

        #region Admin'sOrderService
        public Task<ServiceResponse<bool>> UpdateOrderState(Guid orderId, OrderState state);
        public Task<ServiceResponse<int>> GetOrderState(Guid orderId);
        #endregion Admin'sOrderService
    }
}
