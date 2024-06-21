using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.RequestDTOs.ProductImageDTO
{
    public class AddProductImageDTO
    {
        [Required(ErrorMessage = "Image is required"), MinLength(6, ErrorMessage = "Image url must have at least 6 characters"), StringLength(250, ErrorMessage = "Image url can't be longer than 250 characters")]
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsMain { get; set; }
        [Required(ErrorMessage = "Product id is required")]
        public Guid ProductId { get; set; }
    }
}
