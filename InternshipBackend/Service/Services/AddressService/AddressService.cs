using AutoMapper;
using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Service.DTOs.RequestDTOs.AddressDTO;
using Service.Models;
using Service.Services.AuthService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace Service.Services.AddressService
{
    public class AddressService : IAddressService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;

        public AddressService(DataContext context,IMapper mapper ,IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
        }
        public async Task<ServiceResponse<PagingParams<List<CustomerAddress>>>> GetAddresses(int page)
        {
            var accountId = _authService.GetUserId();

            var customer = await _context.Customers
                                         .FirstOrDefaultAsync(c => c.AccountId == accountId);

            if (customer == null)
            {
                return new ServiceResponse<PagingParams<List<CustomerAddress>>>
                {
                    Success = false,
                    Message = "You need to log in"
                };
            }

            var pageResults = 8f;
            var pageCount = Math.Ceiling(_context.Orders.Count() / pageResults);

            var addresses = await _context.Addresses
                                      .Where(a => a.CustomerId == customer.Id)
                                      .OrderByDescending(a => a.IsMain)
                                      .Skip((page - 1) * (int)pageResults)
                                      .Take((int)pageResults)
                                      .ToListAsync();

            var pagingData = new PagingParams<List<CustomerAddress>>
            {
                Result = addresses,
                CurrentPage = page,
                Pages = (int)pageCount
            };

            return new ServiceResponse<PagingParams<List<CustomerAddress>>>
            {
                Data = pagingData
            };
        }

        public async Task<ServiceResponse<CustomerAddress>> GetSingleAddress(Guid addressId)
        {
            var accountId = _authService.GetUserId();

            var customer = await _context.Customers
                                        .FirstOrDefaultAsync(c => c.AccountId == accountId);

            if (customer == null)
            {
                return new ServiceResponse<CustomerAddress>
                {
                    Success = false,
                    Message = "You need to log in"
                };
            }

            var address = await _context.Addresses
                                       .Where(a => a.CustomerId == customer.Id)
                                       .FirstOrDefaultAsync(a => a.Id == addressId);

            if(address == null)
            {
                return new ServiceResponse<CustomerAddress>
                {
                    Success = false,
                    Message = "Not found"
                };
            }

            return new ServiceResponse<CustomerAddress>
            {
                Data = address
            };
        }

        public async Task<ServiceResponse<CustomerAddress>> GetMainAddress()
        {
            var accountId = _authService.GetUserId();

            var customer = await _context.Customers
                                        .FirstOrDefaultAsync(c => c.AccountId == accountId);

            if (customer == null)
            {
                return new ServiceResponse<CustomerAddress>
                {
                    Success = false,
                    Message = "You need to log in"
                };
            }

            var address = await _context.Addresses
                                       .Where(a => a.IsMain)
                                       .FirstOrDefaultAsync(a => a.CustomerId == customer.Id);

            if (address == null)
            {
                return new ServiceResponse<CustomerAddress>
                {
                    Success = false,
                    Message = "Not found"
                };
            }

            return new ServiceResponse<CustomerAddress>
            {
                Data = address
            };
        }

        public async Task<ServiceResponse<bool>> CreateAddress(CreateAddressDTO newAddress)
        {
            var accountId = _authService.GetUserId();

            var customer = await _context.Customers
                                        .FirstOrDefaultAsync(c => c.AccountId == accountId);

            if (customer == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "You need to log in"
                };
            }

            var address = _mapper.Map<CustomerAddress>(newAddress);
            address.CustomerId = customer.Id;

            //Check if new main address
            //If new image is main address => set already main address in database is not main
            if (address.IsMain == true)
            {
                var mainAddress = _context.Addresses
                                     .Where(a => a.CustomerId == customer.Id)
                                     .FirstOrDefault(pi => pi.IsMain);

                //if it has already main image in database => set that image is not main
                if (mainAddress != null)
                {
                    mainAddress.IsMain = false;
                }
            }

            _context.Addresses.Add(address);
            await _context.SaveChangesAsync();
            
            return new ServiceResponse<bool>
            {
                Data = true
            };
        }

        public async Task<ServiceResponse<bool>> UpdateAddress(Guid addressId, UpdateAddressDTO updateAddress)
        {
            var accountId = _authService.GetUserId();

            var customer = await _context.Customers
                                        .FirstOrDefaultAsync(c => c.AccountId == accountId);

            if (customer == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "You need to log in"
                };
            }

            var dbAddress = await _context.Addresses
                                       .FirstOrDefaultAsync(a => a.Id == addressId);

            if (dbAddress == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Not found address"
                };
            }

            //Check if new main address
            //If new image is main address => set already main address in database is not main
            if (updateAddress.IsMain == true)
            {
                var mainAddress = _context.Addresses
                                     .Where(a => a.CustomerId == customer.Id)
                                     .FirstOrDefault(pi => pi.IsMain);

                //if it has already main image in database => set that image is not main
                if (mainAddress != null)
                {
                    mainAddress.IsMain = false;
                }
            }

            _mapper.Map(updateAddress, dbAddress);
            await _context.SaveChangesAsync();

            return new ServiceResponse<bool>
            {
                Data = true
            };
        }

        public async Task<ServiceResponse<bool>> DeleteAddress(Guid addressId)
        {
            var address = await _context.Addresses
                                      .FirstOrDefaultAsync(a => a.Id == addressId);

            if (address == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Not found address"
                };
            }

            if (address.IsMain)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Can not delete main address"
                };
            }

            _context.Addresses.Remove(address);
            await _context.SaveChangesAsync();

            return new ServiceResponse<bool>
            {
                Data = true
            };
        }
    }
}
