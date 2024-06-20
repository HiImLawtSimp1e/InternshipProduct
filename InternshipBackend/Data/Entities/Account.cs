using Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Data.Entities
{
    public class Account : BaseEntities
    {
        public Guid Id { get; set; }
        public string AccountName { get; set; } = string.Empty;
        public byte[] PasswordHash { get; set; } 
        public byte[] PasswordSalt { get; set; }
        public bool IsActive { get; set; } = true;
        public bool Deleted { get; set; } = false;
        public Guid RoleId { get; set; }
        public Role Role { get; set; }
        [JsonIgnore]
        public Customer? Customer { get; set; }
        [JsonIgnore]
        public Employee? Employee { get; set; }
    }
}
