using Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.RequestDTOs.OrderCounterDTO
{
    public class PlaceOrderCounterDTO
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public List<OrderCounterItemDTO> OrderItems { get; set; } = new List<OrderCounterItemDTO>();
    }
}
