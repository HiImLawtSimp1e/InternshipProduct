using Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Data.Entities
{
    public class Customer     
    {
        public Guid Id { get; set; }
        [JsonIgnore]
        public Guid AccountId { get; set; }
        public Account? Account { get; set; }
        [JsonIgnore]
        public Cart? Cart { get; set; }
        public List<CustomerAddress>? Addresses { get; set; }
    }
}
