﻿using Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Entities
{
    public class ProductAttribute : BaseEntities
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public bool Deleted { get; set; } = false;
    }
}
