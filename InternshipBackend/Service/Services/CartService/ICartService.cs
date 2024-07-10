﻿using Data.Entities;
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
        Task<ServiceResponse<List<CustomerCartItemsDTO>>> GetCartItems(Guid accountId);
        Task<ServiceResponse<bool>> StoreCartItems(Guid accountId, List<StoreCartItemDTO> items);
    }
}
