using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.RequestDTOs.StoreCartDTO
{
    public class StoreCartItemDTO
    {
        public Guid ProductId { get; set; }
        public Guid ProductTypeId { get; set; }
        public int Quantity { get; set; } = 1;
    }
}
