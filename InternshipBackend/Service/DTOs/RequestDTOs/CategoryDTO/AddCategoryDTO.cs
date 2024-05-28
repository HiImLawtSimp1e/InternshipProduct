using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.RequestDTOs.CategoryDTO
{
    public class AddCategoryDTO
    {
        [Required(ErrorMessage = "Category title is required"), MinLength(2, ErrorMessage = "Category title must have at least 2 characters")]
        public string Title { get; set; } = string.Empty;
        [Required(ErrorMessage = "Category slug is required"), MinLength(2, ErrorMessage = "Category slug must have at least 2 characters")]
        public string Slug { get; set; } = string.Empty;
    }
}
