using AutoMapper;
using Data.Entities;
using Service.DTOs.RequestDTOs.OrderCounterDTO;
using Service.DTOs.ResponseDTOs.OrderCounterDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Profiles
{
    public class OrderCounterProfile : Profile
    {
        public OrderCounterProfile() 
        {
            // Map Entity to DTO
            CreateMap<CustomerAddress, OrderCounterCustomerAddressDTO>();
            // Map DTO to Entity
            CreateMap<OrderCounterItemDTO, OrderItem>();
        }
    }
}
