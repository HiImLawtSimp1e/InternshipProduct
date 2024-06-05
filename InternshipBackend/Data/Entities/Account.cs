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
        public string Role { get; set; } = "Customer";
        [JsonIgnore]
        public Customer Customer { get; set; }
    }
}
