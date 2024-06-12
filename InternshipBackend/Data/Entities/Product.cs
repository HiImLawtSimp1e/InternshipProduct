using Data.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Entities
{
    public class Product : BaseEntities
    {
        public Guid Id { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string SeoTitle { get; set; } = string.Empty;
        public string SeoDescription { get; set; } = string.Empty;
        public string SeoKeyworks { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public bool Deleted { get; set; } = false;
        public Category? Category { get; set; }
        public Guid CategoryId { get; set; }
        public List<ProductVariant> ProductVariants { get; set; } = new List<ProductVariant>();
    }
}
