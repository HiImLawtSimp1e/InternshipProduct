using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.RequestDTOs.AccountDTO
{
    public class RegisterDTO
    {
        [Required(ErrorMessage = "Account name is required")]
        public string AccountName { get; set; } = string.Empty;
        [Required(ErrorMessage = "Password is required"), StringLength(100, MinimumLength = 6, ErrorMessage = "Password have to shorter than 100 characters & minimum characters is 6")]
        public string Password { get; set; } = string.Empty;
        [Compare("Password", ErrorMessage = "The passwords do not match")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
