using AutoMapper;
using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Service.DTOs.RequestDTOs.AccountDTO;
using Service.DTOs.ResponseDTOs.AccountDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.AccountService
{
    public class AccountService : IAccountService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public AccountService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        #region ManageAcountService
        public async Task<ServiceResponse<PagingParams<List<AccountListResponseDTO>>>> GetAdminAccounts(int page)
        {
            var pageResults = 10f;
            var pageCount = Math.Ceiling(_context.Accounts.Where(p => !p.Deleted).Count() / pageResults);

            try
            {
                var accounts = await _context.Accounts
                   .Where(a => !a.Deleted)
                   .OrderByDescending(a => a.ModifiedAt)
                   .Skip((page - 1) * (int)pageResults)
                   .Take((int)pageResults)
                   .Include(a => a.Role)
                   .ToListAsync();

                var result = _mapper.Map<List<AccountListResponseDTO>>(accounts);

                var pagingData = new PagingParams<List<AccountListResponseDTO>>
                {
                    Result = result,
                    CurrentPage = page,
                    Pages = (int)pageCount
                };

                return new ServiceResponse<PagingParams<List<AccountListResponseDTO>>>
                {
                    Data = pagingData,
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<AccountResponseDTO>> GetAdminSingleAccount(Guid accountId)
        {
            var account = await _context.Accounts
                                      .Where(a => !a.Deleted)
                                      .Include(a => a.Role)
                                      .FirstOrDefaultAsync(a => a.Id == accountId);

            if (account == null)
            {
                return new ServiceResponse<AccountResponseDTO>
                {
                    Success = false,
                    Message = "Cannot find account"
                };
            }

            var result = _mapper.Map<AccountResponseDTO>(account); // Mapping Account Entity => result(DTO)

            if (account.Role.RoleName == "Customer")
            {
                var customer = await _context.Customers
                                           .FirstOrDefaultAsync(c => c.AccountId == accountId);

                _mapper.Map(customer, result); // Mapping Customer Entity => result(DTO)
            }
            if (account.Role.RoleName == "Admin" || account.Role.RoleName == "Employee")
            {
                var employee = await _context.Employees
                                            .FirstOrDefaultAsync(c => c.AccountId == accountId);
                _mapper.Map(employee, result); // Mapping Empolyeer Entity => result(DTO)
            }

            return new ServiceResponse<AccountResponseDTO>
            {
                Data = result
            };
        }

        public async Task<ServiceResponse<List<Role>>> GetAdminRoles()
        {
            var roles = await _context.Roles
                                    .ToListAsync();
            return new ServiceResponse<List<Role>>()
            {
                Data = roles
            };
        }

        public async Task<ServiceResponse<bool>> CreateAccount(CreateAccountDTO newAccount)
        {
            try
            {
                //check account name exist
                if (await AccountExists(newAccount.AccountName))
                {
                    return new ServiceResponse<bool>
                    {
                        Success = false,
                        Message = "User already exists"
                    };
                }

                var account = new Account();

                // set role
                var role = await _context.Roles.FirstOrDefaultAsync(r => r.Id == newAccount.RoleId);
                if (role == null)
                {
                    return new ServiceResponse<bool>
                    {
                        Success = false,
                        Message = "Cannot find role"
                    };
                }

                if(role.RoleName == "Customer")
                {
                    // set customer's information
                    var customer = new Customer
                    {
                        FullName = newAccount.FullName,
                        Email = newAccount.Email,
                        Phone = newAccount.Phone,
                        Address = newAccount.Address,
                    };

                    var customerAccount = new Account
                    {
                        AccountName = newAccount.AccountName,
                        Customer = customer,
                        RoleId = role.Id,
                        Role = role
                    };

                    account = customerAccount;
                }

                if(role.RoleName == "Admin" || role.RoleName == "Employee")
                {
                    // set employee's information
                    var employee = new Employee
                    {
                        FullName = newAccount.FullName,
                        Email = newAccount.Email,
                        Phone = newAccount.Phone,
                        Address = newAccount.Address,
                    };

                    var employeeAccount = new Account
                    {
                        AccountName = newAccount.AccountName,
                        Employee = employee,
                        RoleId = role.Id,
                        Role = role
                    };

                    account = employeeAccount;
                }

                var password = newAccount.Password;
                //hash password
                CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);

                account.PasswordHash = passwordHash;
                account.PasswordSalt = passwordSalt;

                _context.Accounts.Add(account);
                await _context.SaveChangesAsync();
                return new ServiceResponse<bool>
                {
                    Message = "Created account successfully!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<bool>> UpdateAccount(Guid accountId, UpdateInfoAccountDTO updateInfoAccount)
        {
            try
            {
                var dbAccount = await _context.Accounts
                                       .Where(a => !a.Deleted)
                                       .Include(a => a.Role)
                                       .FirstOrDefaultAsync(a => a.Id == accountId);

                if (dbAccount == null)
                {
                    return new ServiceResponse<bool>
                    {
                        Success = false,
                        Message = "Cannot find account"
                    };
                }

                if (dbAccount.Role.RoleName == "Customer")
                {
                   var dbCustomer = await _context.Customers
                                                 .FirstOrDefaultAsync(e => e.AccountId == accountId);
                    // set employee's information
                    dbCustomer.FullName = updateInfoAccount.FullName;
                    dbCustomer.Email = updateInfoAccount.Email;
                    dbCustomer.Phone = updateInfoAccount.Phone;
                    dbCustomer.Address = updateInfoAccount.Address;

                    dbAccount.IsActive = updateInfoAccount.IsActive;
                }
                else if (dbAccount.Role.RoleName == "Admin" || dbAccount.Role.RoleName == "Employee")
                {
                    var dbEmployee = await _context.Employees
                                                  .FirstOrDefaultAsync(e => e.AccountId == accountId);
                    // set employee's information
                    dbEmployee.FullName = updateInfoAccount.FullName;
                    dbEmployee.Email = updateInfoAccount.Email;
                    dbEmployee.Phone = updateInfoAccount.Phone;
                    dbEmployee.Address = updateInfoAccount.Address;

                    dbAccount.IsActive = updateInfoAccount.IsActive;
                }
                else
                {
                    return new ServiceResponse<bool>
                    {
                        Success = false,
                        Message = "Something error!!!"
                    };
                }
                await _context.SaveChangesAsync();
                return new ServiceResponse<bool>
                {
                    Message = "Updated account successfuly!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ServiceResponse<bool>> SoftDeleteAccount(Guid accountId)
        {
            var account = await _context.Accounts
                                      .Where(a => !a.Deleted)
                                      .FirstOrDefaultAsync(a => a.Id == accountId);
            if(account == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Cannot find account"
                };
            }
            account.Deleted = true;
            await _context.SaveChangesAsync();
            return new ServiceResponse<bool>
            {
                Message = "Deleted account successfully!"
            };

        }

        #endregion ManageAccountService

        #region PrivateService

        // generate jwt
        private string CreateToken(Account account)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, account.Id.ToString()),
                new Claim(ClaimTypes.Name, account.AccountName),
                new Claim(ClaimTypes.Role, account.Role.RoleName),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("my top secret key my top top secret key my top top secret key;"));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                     claims: claims,
                     expires: DateTime.Now.AddDays(7),
                     signingCredentials: creds
                );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        // verify hash password
        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        //check account name exist
        public async Task<bool> AccountExists(string accountName)
        {
            if (await _context.Accounts
                .AnyAsync(account => account.AccountName.ToLower()
                .Equals(accountName.ToLower())))
            {
                return true;
            }
            return false;
        }

        //hash password
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            }
        }
        #endregion PrivateService
    }
}
