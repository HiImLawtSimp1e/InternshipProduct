using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.RequestDTOs.ProductVariantDTO
{
    public class UpdateProductVariantDTO
    {
        [Required(ErrorMessage = "ProductTypeId of product variant is required")]
        public Guid ProductTypeId { get; set; }
        [Required(ErrorMessage = "price is required"), Range(1000, int.MaxValue, ErrorMessage = "Price is must be integer & greater than 1000")]
        public int Price { get; set; }
        [Range(0, int.MaxValue, ErrorMessage = "Price is must be integer & greater than 1000")]
        public int OriginalPrice { get; set; }
        [Required(ErrorMessage = "Quantity is required"), Range(0, int.MaxValue, ErrorMessage = "Quantity is must be integer")]
        public int Quantity { get; set; }
        public bool IsActive { get; set; }
    }
}
