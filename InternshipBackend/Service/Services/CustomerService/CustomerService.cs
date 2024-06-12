using AutoMapper;
using Data.Context;
using Data.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Service.DTOs.RequestDTOs.CustomerDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.CustomerService
{
    public class CustomerService : ICustomerService
    {
        private readonly DataContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMapper _mapper;

        public CustomerService(DataContext context, IHttpContextAccessor httpContextAccessor, IMapper mapper)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
        }
        public async Task<ServiceResponse<Customer>> AddOrUpdateInfoCustomer(CustomerDTO customerDTO)
        {
            var nameIdentifier = GetNameIdentifier();
            if (nameIdentifier == null)
            {
                return new ServiceResponse<Customer>
                {
                    Success = false,
                    Message = "Not found name identifier"
                };
            }
            var accountId = new Guid(nameIdentifier);
            var dbCustomerInfo = await _context.Customers.FirstOrDefaultAsync(c => c.AccountId == accountId);
            try
            {
                if (dbCustomerInfo == null)
                {
                    var customer = _mapper.Map<Customer>(customerDTO);
                    customer.AccountId = accountId;
                    _context.Customers.Add(customer);
                    await _context.SaveChangesAsync();
                    return new ServiceResponse<Customer>
                    {
                        Data = customer
                    };
                }
                _mapper.Map(customerDTO, dbCustomerInfo);
                await _context.SaveChangesAsync();
                return new ServiceResponse<Customer>
                {
                   Data = dbCustomerInfo
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<Customer>> GetInfoCustomer()
        {
            var nameIdentifier = GetNameIdentifier();
            if (nameIdentifier == null)
            {
                return new ServiceResponse<Customer>
                {
                    Success = false,
                    Message = "You need to log in"
                };
            }
            try
            {
                var accountId = new Guid(nameIdentifier);
                var customerInfo = await _context.Customers.FirstOrDefaultAsync(c => c.AccountId == accountId);
                return new ServiceResponse<Customer>
                {
                    Data = customerInfo
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private string GetNameIdentifier()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            var nameIdentifier = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            return nameIdentifier;
        }
    }
}
