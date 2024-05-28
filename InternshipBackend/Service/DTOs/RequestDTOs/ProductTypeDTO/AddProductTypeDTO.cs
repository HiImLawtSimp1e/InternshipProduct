using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.RequestDTOs.ProductTypeDTO
{
    public class AddProductTypeDTO
    {
        [Required(ErrorMessage = "Product type name is required"), MinLength(2, ErrorMessage = "Product type name must have at least 2 characters")]
        public string Name { get; set; } = string.Empty;
    }
}
