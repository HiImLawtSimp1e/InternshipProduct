using Data.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.ResponseDTOs.AccountDTO
{
    public class AccountResponseDTO
    {
        public Guid Id { get; set; }

        public string AccountName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public Role Role { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
    }
}
