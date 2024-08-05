using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.RequestDTOs.AccountDTO
{
    public class UpdateInfoAccountDTO
    {
        [Required(ErrorMessage = "FullName is required"), MinLength(6, ErrorMessage = "FullName need to at least 6 characters"), StringLength(50, ErrorMessage = "FullName can't longer than 50 characters")]
        public string FullName { get; set; } = string.Empty;
        [Required(ErrorMessage = "Email is required"), EmailAddress(ErrorMessage = "Email is not valid")]
        public string Email { get; set; } = string.Empty;
        [Required(ErrorMessage = "Phone number is required"), RegularExpression(@"^(\+?\d{1,3})?0?\d{9}$", ErrorMessage = "Phone number is not valid")]
        public string Phone { get; set; } = string.Empty;
        [Required(ErrorMessage = "Address is required"), MinLength(6, ErrorMessage = "Address need to at least 6 characters"), StringLength(250, ErrorMessage = "Address can't longer than 250 characters")]
        public string Address { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
