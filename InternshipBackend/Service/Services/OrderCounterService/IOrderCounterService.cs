using Data.Entities;
using Service.DTOs.RequestDTOs.OrderCounterDTO;
using Service.DTOs.ResponseDTOs.OrderCounterDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.OrderCounterService
{
    public interface IOrderCounterService
    {
        Task<ServiceResponse<bool>> PlaceOrderCounter(Guid? voucherId, PlaceOrderCounterDTO newOrderCounter);
        Task<ServiceResponse<List<OrderCounterCustomerAddressDTO>>> SearchCustomerAddressCards(string searchText);
        Task<ServiceResponse<List<OrderItemResponseDTO>>> SearchProducts(string searchText);
        Task<ServiceResponse<List<PaymentMethod>>> GetPaymentMethodSelect();
    }
}
