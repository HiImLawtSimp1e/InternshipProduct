using AutoMapper;
using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Service.DTOs.RequestDTOs.ContactDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.ContactService
{
    public class ContactService : IContactService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ContactService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<ServiceResponse<List<Contact>>> GetAdminContacts()
        {
            try
            {
                var contacts = await _context.Contacts.ToListAsync();
                return new ServiceResponse<List<Contact>>
                {
                    Data = contacts,
                };
            }
            catch(Exception ex)
            {
                throw ex;
            }

        }

        public async Task<ServiceResponse<bool>> SendContact(SendContactDTO newContact)
        {
            try
            {
                var contact = _mapper.Map<Contact>(newContact);
                _context.Contacts.Add(contact);
                await _context.SaveChangesAsync();
                return new ServiceResponse<bool>
                {
                    Data = true,
                    Message = "Send Your Contact Successfully!!!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
