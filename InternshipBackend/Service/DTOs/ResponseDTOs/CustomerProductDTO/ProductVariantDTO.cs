using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.ResponseDTOs.CustomerProductDTO
{
    public class ProductVariantDTO
    {
        public Guid ProductId { get; set; }
        public ProductTypeDTO ProductType { get; set; }
        public Guid ProductTypeId { get; set; }
        public decimal Price { get; set; }
        public decimal OriginalPrice { get; set; }

    }
}
