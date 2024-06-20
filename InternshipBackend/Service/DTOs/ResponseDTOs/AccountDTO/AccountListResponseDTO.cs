using Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.ResponseDTOs.AccountDTO
{
    public class AccountListResponseDTO
    {
        public Guid Id { get; set; }

        public string AccountName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public Role Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }
    }
}
