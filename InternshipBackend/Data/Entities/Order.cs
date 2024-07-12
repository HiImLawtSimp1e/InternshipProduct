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
        public Guid CustomerId { get; set; }
        public string InvoiceCode { get; set; } = string.Empty;
        public int TotalPrice { get; set; }
        public OrderState State { get; set; } = OrderState.Pending;
        public List<OrderItem>? OrderItems { get; set; }
    }
}
