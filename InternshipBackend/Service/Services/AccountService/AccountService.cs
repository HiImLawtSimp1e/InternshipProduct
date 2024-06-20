using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Service.DTOs.RequestDTOs.AccountDTO;
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

        public AccountService(DataContext context)
        {
            _context = context;
        }

        #region ManageAcountService
        public async Task<ServiceResponse<PagingParams<List<Account>>>> GetAdminAccounts(int page)
        {
            var pageResults = 10f;
            var pageCount = Math.Ceiling(_context.Accounts.Where(p => !p.Deleted).Count() / pageResults);

            try
            {
                var accounts = await _context.Accounts
                   .Where(c => !c.Deleted)
                   .OrderByDescending(p => p.ModifiedAt)
                   .Skip((page - 1) * (int)pageResults)
                   .Take((int)pageResults)
                   .ToListAsync();

                var pagingData = new PagingParams<List<Account>>
                {
                    Result = accounts,
                    CurrentPage = page,
                    Pages = (int)pageCount
                };

                return new ServiceResponse<PagingParams<List<Account>>>
                {
                    Data = pagingData,
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<Account>> GetAdminSingleAccount(Guid accountId)
        {
            var account = await _context.Accounts
                                      .Where(a => !a.Deleted)
                                      .Include(a => a.Role)
                                      .FirstOrDefaultAsync(a => a.Id == accountId);

            if (account == null)
            {
                return new ServiceResponse<Account>
                {
                    Success = false,
                    Message = "Cannot find account"
                };
            }

            if (account.Role.RoleName == "Customer")
            {
                var customerAccount = await _context.Accounts
                                    .Where(a => !a.Deleted)
                                    .Include(a => a.Role)
                                    .Include(a => a.Customer)
                                    .FirstOrDefaultAsync(a => a.Id == accountId);
                return new ServiceResponse<Account>
                {
                    Data = customerAccount
                };
            }
            if (account.Role.RoleName == "Admin" || account.Role.RoleName == "Employee")
            {
                var employeeAccount = await _context.Accounts
                                     .Where(a => !a.Deleted)
                                     .Include(a => a.Role)
                                     .Include(a => a.Employee)
                                     .FirstOrDefaultAsync(a => a.Id == accountId);
                return new ServiceResponse<Account>
                {
                    Data = employeeAccount
                };
            }
            return new ServiceResponse<Account>
            {
                Success = false,
                Message = "Something error!!!"
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
                    return new ServiceResponse<bool>
                    {
                        Success = false,
                        Message = "Cannot update customer account by admin!!"
                    };
                }
                else if (dbAccount.Role.RoleName == "Admin" || dbAccount.Role.RoleName == "Employee")
                {
                    // set employee's information
                    var employee = new Employee
                    {
                        FullName = updateInfoAccount.FullName,
                        Email = updateInfoAccount.Email,
                        Phone = updateInfoAccount.Phone,
                        Address = updateInfoAccount.Address,
                    };

                    dbAccount.Employee = employee;
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

        #region AuthService

        public async Task<ServiceResponse<bool>> ChangePassword(Guid accountId, string newPassword)
        {
            var account = await _context.Accounts.FirstOrDefaultAsync(account => account.Id == accountId);
            if (account == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "User not found"
                };
            }

            CreatePasswordHash(newPassword, out byte[] passwordHash, out byte[] passwordSalt);

            account.PasswordHash = passwordHash;
            account.PasswordSalt = passwordSalt;

            await _context.SaveChangesAsync();

            return new ServiceResponse<bool>
            {
                Data = true,
                Message = "Password has been change"
            };
        }

        public async Task<ServiceResponse<string>> Login(LoginDTO loginDTO)
        {
            var accountName = loginDTO.AccountName;
            var password = loginDTO.Password;
            var account = await _context.Accounts
                                        .Include(a => a.Role)
                                        .FirstOrDefaultAsync(a => a.AccountName.ToLower().Equals(accountName.ToLower()));
            if (account == null)
            {
                return new ServiceResponse<string>
                {
                    Success = false,
                    Message = "User not found"
                };
            }
            else if (!VerifyPasswordHash(password, account.PasswordHash, account.PasswordSalt))
            {
                return new ServiceResponse<string>
                {
                    Success = false,
                    Message = "Wrong password"
                };
            }
            else
            {
                var token = CreateToken(account);
                return new ServiceResponse<string>
                {
                    Data = token
                };
            }
        }

        public async Task<ServiceResponse<int>> Register(RegisterDTO registerDTO)
        {
            try
            {
                //check account name exist
                if (await AccountExists(registerDTO.AccountName))
                {
                    return new ServiceResponse<int>
                    {
                        Success = false,
                        Message = "User already exists"
                    };
                }

                // set role for register
                var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == "Customer");
                if (role == null)
                {
                    return new ServiceResponse<int>
                    {
                        Success = false,
                        Message = "Something error!!!"
                    };
                }

                // set customer's information
                var customer = new Customer
                {
                    FullName = registerDTO.FullName,
                    Email = registerDTO.Email,
                    Phone = registerDTO.Phone,
                    Address = registerDTO.Address,
                };

                var account = new Account
                {
                    AccountName = registerDTO.AccountName,
                    Customer = customer,
                    RoleId = role.Id,
                    Role = role
                };

                var password = registerDTO.Password;
                //hash password
                CreatePasswordHash(password, out byte[] passwordHash, out byte[] passwordSalt);

                account.PasswordHash = passwordHash;
                account.PasswordSalt = passwordSalt;

                _context.Accounts.Add(account);
                await _context.SaveChangesAsync();
                return new ServiceResponse<int>
                {
                    Message = "Registration successful !"
                };
            }
            catch(Exception ex)
            {
                throw ex;
            }

        }

        #endregion AuthService

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
