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
        public int TotalPrice { get; set; }
        public List<OrderItem>? OrderItems { get; set; }
    }
}
