using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Entities
{
    public class OrderItem
    {
        public Order? Order { get; set; }
        public Guid OrderId { get; set; }
        public Product? Product { get; set; }
        public Guid ProductId { get; set; }
        public ProductType? ProductType { get; set; }
        public Guid ProductTypeId { get; set; }
        public string ProductTitle { get; set; } = string.Empty;
        public string ProductTypeName { get; set; } = string.Empty;
        public int Price { get; set; }
        public int OriginalPrice { get; set; }
        public int Quantity { get; set; }
    }
}
