using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.RequestDTOs.ProductDTO
{
    public class AddProductDTO
    {
        [Required(ErrorMessage = "Product title is required"), MinLength(2, ErrorMessage = "Product title must have at least 2 characters")]
        public string Title { get; set; } = string.Empty;
        [Required(ErrorMessage = "Product slug is required"), MinLength(2, ErrorMessage = "Product slug must have at least 2 characters")]
        public string Slug { get; set; } = string.Empty;
        [Required(ErrorMessage = "Product description is required"), MinLength(6, ErrorMessage = "Product description must have at least 6 characters")]
        public string Description { get; set; } = string.Empty;
        [StringLength(70, ErrorMessage = "SEO Title can't be longer than 70 characters")]
        public string SeoTitle { get; set; } = string.Empty;

        [StringLength(160, ErrorMessage = "SEO Description can't be longer than 160 characters")]
        public string SeoDescription { get; set; } = string.Empty;

        [StringLength(100, ErrorMessage = "SEO Keywords can't be longer than 100 characters")]
        public string SeoKeyworks { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public Guid CategoryId { get; set; }
    }
}
