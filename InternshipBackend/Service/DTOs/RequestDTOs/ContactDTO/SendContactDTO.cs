using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.RequestDTOs.ContactDTO
{
    public class SendContactDTO
    {
        [Required(ErrorMessage = "Name is required"), StringLength(50, ErrorMessage = "Message can't longer than 50 characters")]
        public string Name { get; set; } = string.Empty;
        [Required(ErrorMessage = "Email is required"), EmailAddress(ErrorMessage = "The Email field is not valid")]
        public string Email { get; set; } = string.Empty;
        [Required(ErrorMessage = "Message is required"), MinLength(6, ErrorMessage ="Message must have at least 6 characters"), StringLength(2500, ErrorMessage = "Message can't longer than 2500 characters")]
        public string Message { get; set; } = string.Empty;
    }
}
