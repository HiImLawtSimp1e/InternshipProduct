using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.RequestDTOs.AccountDTO
{
    public class CreateAccountDTO
    {
        [Required(ErrorMessage = "Account name is required"), StringLength(100, MinimumLength = 6, ErrorMessage = "Account name have to shorter than 100 characters & minimum characters is 6")]
        public string AccountName { get; set; } = string.Empty;
        [Required(ErrorMessage = "Password is required"), StringLength(100, MinimumLength = 6, ErrorMessage = "Password have to shorter than 100 characters & minimum characters is 6")]
        public string Password { get; set; } = string.Empty;
        [Required(ErrorMessage = "FullName is required"), MinLength(6, ErrorMessage = "FullName need to at least 6 characters"), StringLength(50, ErrorMessage = "FullName can't longer than 50 characters")]
        public string FullName { get; set; } = string.Empty;
        [Required(ErrorMessage = "Email is required"), EmailAddress(ErrorMessage = "Email is not valid")]
        public string Email { get; set; } = string.Empty;
        [Required(ErrorMessage = "Phone number is required"), RegularExpression(@"^(\+?\d{1,3})?0?\d{9}$", ErrorMessage = "Phone number is not valid")]
        public string Phone { get; set; } = string.Empty;
        [Required(ErrorMessage = "Address is required"), MinLength(6, ErrorMessage = "Address need to at least 6 characters"), StringLength(250, ErrorMessage = "Address can't longer than 250 characters")]
        public string Address { get; set; } = string.Empty;
        public Guid RoleId { get; set; }
    }
}
