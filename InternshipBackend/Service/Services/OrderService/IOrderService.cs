using Data.Entities;
using Data.Enums;
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
        public Task<ServiceResponse<bool>> PlaceOrder(Guid accountId);
        public Task<ServiceResponse<PagingParams<List<Order>>>> GetAdminOrders(int page);
        public Task<ServiceResponse<List<OrderItemDTO>>> GetAdminOrderItems(Guid orderId);
        public Task<ServiceResponse<OrderDetailCustomerDTO>> GetAdminOrderCustomerInfo(Guid orderId);
        public Task<ServiceResponse<bool>> UpdateOrderState(Guid orderId, OrderState state);
        public Task<ServiceResponse<int>> GetOrderState(Guid orderId);
    }
}
