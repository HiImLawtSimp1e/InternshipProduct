using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.RequestDTOs.ProductDTO
{
    public class UpdateProductDTO
    {
        [Required(ErrorMessage = "Product id is required")]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Product title is required"), MinLength(2, ErrorMessage = "Product title must have at least 2 characters")]
        public string Title { get; set; } = string.Empty;
        [Required(ErrorMessage = "Product slug is required"), MinLength(2, ErrorMessage = "Product slug must have at least 2 characters")]
        public string Slug { get; set; } = string.Empty;
        [Required(ErrorMessage = "Product description is required"), MinLength(6, ErrorMessage = "Product description must have at least 6 characters")]
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }
        public List<UpdateProductVariantDTO> ProductVariants { get; set; }
    }
}
