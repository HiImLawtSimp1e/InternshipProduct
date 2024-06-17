using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.ResponseDTOs.CustomerCategoryDTO
{
    public class CategorySelectResponseDTO
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
    }
}
