using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.ResponseDTOs.OrerDetailDTO
{
    public class OrderDetailCustomerDTO
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string InvoiceCode { get; set; } = string.Empty;
        public DateTime OrderCreatedAt { get; set; }

    }
}
