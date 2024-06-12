using Data.Entities;
using Service.DTOs.RequestDTOs.ContactDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.ContactService
{
    public interface IContactService
    {
        Task<ServiceResponse<bool>> SendContact(SendContactDTO newContact);
        Task<ServiceResponse<List<Contact>>> GetAdminContacts();
    }
}
