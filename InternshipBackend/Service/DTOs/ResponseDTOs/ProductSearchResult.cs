using Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.ResponseDTOs
{
    public class ProductSearchResult
    {
        public List<Product> Products { get; set; }
        public int Pages { get; set; }
        public int CurrentPage { get; set; }
    }
}
