using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.RequestDTOs.ProductValueDTO
{
    public class UpdateProductValueDTO
    {
        [Required(ErrorMessage = "ProductAttributeId of product value is required")]
        public Guid ProductAttributeId { get; set; }
        [Required(ErrorMessage = "Product attribute value is required"), MinLength(2, ErrorMessage = "Product attribute value must have at least 2 characters")]
        public string Value { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
