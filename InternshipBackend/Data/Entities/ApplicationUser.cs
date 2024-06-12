using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string? Name { get; set; }
        public string? Address { get; set; }
        public string? ImageUrl { get; set; }
        public int Status { get; set; }
    }
}
