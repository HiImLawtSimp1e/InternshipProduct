using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.RequestDTOs.ProductAttributeDTO
{
    public class UpdateProductAttributeDTO
    {

        [Required(ErrorMessage = "Product attribute id is required")]
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Product attribute name is required"), MinLength(2, ErrorMessage = "Product attribute name must have at least 2 characters")]
        public string Name { get; set; } = string.Empty;
    }
}
