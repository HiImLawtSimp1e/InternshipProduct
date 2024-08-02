using Data.Entities;
using Service.DTOs.RequestDTOs.StoreCartDTO;
using Service.DTOs.ResponseDTOs.CustomerCartItemsDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.CartService
{
    public interface ICartService
    {
        Task<ServiceResponse<List<CustomerCartItemsDTO>>> GetCartItems();
        Task<ServiceResponse<bool>> StoreCartItems(List<StoreCartItemDTO> items);
        Task<ServiceResponse<bool>> AddToCart(StoreCartItemDTO newItem);
        Task<ServiceResponse<bool>> UpdateQuantity(StoreCartItemDTO updateItem);
        Task<ServiceResponse<bool>> RemoveFromCart(Guid productId, Guid productTypeId);
        Task<int> GetCartTotalAmountAsync();
    }
}
