using Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.ResponseDTOs.CustomerProductDTO
{
    public class ProductValueDTO
    {
        public Guid ProductId { get; set; }
        public ProductAttributeDTO? ProductAttribute { get; set; }
        public Guid ProductAttributeId { get; set; }
        public string Value { get; set; } = string.Empty;
    }
}
