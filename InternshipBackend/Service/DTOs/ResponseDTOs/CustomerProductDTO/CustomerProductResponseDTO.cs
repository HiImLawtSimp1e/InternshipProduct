using Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.ResponseDTOs.CustomerProductDTO
{
    public class CustomerProductResponseDTO
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string SeoTitle { get; set; } = string.Empty;
        public string SeoDescription { get; set; } = string.Empty;
        public string SeoKeyworks { get; set; } = string.Empty;
        public List<ProductVariantDTO> ProductVariants { get; set; } = new List<ProductVariantDTO>();
        public List<ProductImage> ProductImages { get; set; } = new List<ProductImage>();
    }
}
