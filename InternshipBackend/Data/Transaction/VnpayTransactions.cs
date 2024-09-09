using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Transation
{
    public class VnpayTransactions
    {
        [Required]
        public string TransactionId { get; set; }
        public Guid UserId {  get; set; }  
        public Guid? VoucherId { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreateAt { get; set; } = DateTime.Now;
    }
}
