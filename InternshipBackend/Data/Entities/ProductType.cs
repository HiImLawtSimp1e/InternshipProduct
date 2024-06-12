using Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Entities
{
    public class ProductType : BaseEntities
    {
        public Guid Id { get; set; }
        public string Name { get; set; }   
    }
}
