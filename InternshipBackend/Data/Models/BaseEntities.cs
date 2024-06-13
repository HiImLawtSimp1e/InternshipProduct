using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Models
{
    public class BaseEntities
    {
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime ModifiedAt { get; set;} = DateTime.Now;
        public string CreatedBy { get; set; } = string.Empty;
        public string ModifiedBy { get; set;} = string.Empty;
    }
}
