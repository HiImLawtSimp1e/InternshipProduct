using Data.Entities;
using Service.DTOs.RequestDTOs.CustomerDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.CustomerService
{
    public interface ICustomerService
    {
        Task<ServiceResponse<Customer>> GetInfoCustomer();
        Task<ServiceResponse<Customer>> AddOrUpdateInfoCustomer(CustomerDTO customerDTO);
    }
}
