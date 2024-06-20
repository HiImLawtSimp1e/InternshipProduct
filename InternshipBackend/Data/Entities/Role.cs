using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Data.Entities
{
    public class Role
    {
        public Guid Id { get; set; }
        public string RoleName { get; set; } = string.Empty;
    }
}
