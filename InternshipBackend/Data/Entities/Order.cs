using Data.Enums;
using Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Entities
{
    public class Order : BaseEntities
    {
        public Guid Id { get; set; }
        public string InvoiceCode { get; set; } = string.Empty;
        public int TotalPrice { get; set; } = 0;
        public OrderState State { get; set; } = OrderState.Pending;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public int DiscountValue { get; set; } = 0;
        public Guid? CustomerId { get; set; }
        public Guid? VoucherId { get; set; }
        public PaymentMethod? PaymentMethod { get; set; }
        public Guid PaymentMethodId { get; set; }
        public List<OrderItem>? OrderItems { get; set; }
    }
}
