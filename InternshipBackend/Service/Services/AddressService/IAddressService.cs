using Data.Entities;
using Service.DTOs.RequestDTOs.AddressDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.AddressService
{
    public interface IAddressService
    {
        Task<ServiceResponse<PagingParams<List<CustomerAddress>>>> GetAddresses(int page);
        Task<ServiceResponse<CustomerAddress>> GetSingleAddress(Guid addressId);
        Task<ServiceResponse<CustomerAddress>> GetMainAddress();
        Task<ServiceResponse<bool>> CreateAddress(CreateAddressDTO newAddress);
        Task<ServiceResponse<bool>> UpdateAddress(Guid addressId ,UpdateAddressDTO updateAddress);
        Task<ServiceResponse<bool>> DeleteAddress(Guid addressId);
    }
}
