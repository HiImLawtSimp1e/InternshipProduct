using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.RequestDTOs.AccountDTO
{
    public class ChangePasswordDTO
    {
        [Required(ErrorMessage = "The old password has not been entered")]
        public string OldPassword { get; set; } = string.Empty;
        [Required(ErrorMessage = "The new password cannot be empty"), StringLength(100, MinimumLength = 6, ErrorMessage = "The new password must not be longer than 100 characters and shorter than 6 characters")]
        public string Password { get; set; } = string.Empty;
        [Compare("Password", ErrorMessage = "Confirm password does not match")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
