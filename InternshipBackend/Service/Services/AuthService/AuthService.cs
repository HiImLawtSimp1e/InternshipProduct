using AutoMapper;
using Data.Context;
using Data.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Service.DTOs.RequestDTOs.AccountDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Service.Services.AuthService
{
    public class AuthService : IAuthService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthService(DataContext context, IMapper mapper, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _mapper = mapper;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }
        #region AuthService

        public Guid GetUserId() => new Guid(_httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier));

        public string GetUserName() => _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);

        public async Task<Customer> GetCustomerById(Guid userId)
        {
            var customer = await _context.Customers
                                        .Include(c => c.Cart)
                                        .FirstOrDefaultAsync(c => c.AccountId == userId);
            return customer;
        }

        public async Task<ServiceResponse<bool>> ChangePassword(ChangePasswordDTO changePasswordDto)
        {
            var accountId = GetUserId();

            var account = await _context.Accounts.FirstOrDefaultAsync(account => account.Id == accountId);
            if (account == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "You need to log in"
                };
            }

            if (!VerifyPasswordHash(changePasswordDto.OldPassword, account.PasswordHash, account.PasswordSalt))
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "The old password is incorrect"
                };
            }

            CreatePasswordHash(changePasswordDto.Password, out byte[] passwordHash, out byte[] passwordSalt);

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
            else if (!account.IsActive)
            {
                return new ServiceResponse<string>
                {
                    Success = false,
                    Message = "Your account is locked"
                };
            }
            else if (account.Role.RoleName != "Customer")
            {
                return new ServiceResponse<string>
                {
                    Success = false,
                    Message = "You do not have access."
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

        public async Task<ServiceResponse<string>> AdminLogin(LoginDTO loginDTO)
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
            else if (!account.IsActive)
            {
                return new ServiceResponse<string>
                {
                    Success = false,
                    Message = "Your account is locked"
                };
            }
            else if (account.Role.RoleName != "Admin" && account.Role.RoleName != "Employee")
            {
                return new ServiceResponse<string>
                {
                    Success = false,
                    Message = "You do not have access."
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

        public async Task<ServiceResponse<string>> Register(RegisterDTO registerDTO)
        {
            try
            {
                //check account name exist
                if (await AccountExists(registerDTO.AccountName))
                {
                    return new ServiceResponse<string>
                    {
                        Success = false,
                        Message = string.Format("User \"{0}\" already exists", registerDTO.AccountName)
                    };
                }

                // set role for register
                var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == "Customer");
                if (role == null)
                {
                    return new ServiceResponse<string>
                    {
                        Success = false,
                        Message = "Something error!!!"
                    };
                }

                var address = new CustomerAddress
                {
                    FullName = registerDTO.FullName,
                    Email = registerDTO.Email,
                    Phone = registerDTO.Phone,
                    Address = registerDTO.Address,
                    IsMain = true
                };

                // set customer's information
                var customer = new Customer
                {
                    Addresses = new List<CustomerAddress>()
                };
                customer.Addresses.Add(address);

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

                var token = CreateToken(account);

                return new ServiceResponse<string>
                {
                    Data = token,
                    Message = "Registration successfully!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public async Task<ServiceResponse<string>> VerifyToken(string token)
        {
            var response = new ServiceResponse<string>();

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_configuration.GetSection("AppSetting:Token").Value);

                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false, // Set to true if you want to validate the issuer
                    ValidateAudience = false, // Set to true if you want to validate the audience
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                var principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);

                if (validatedToken is JwtSecurityToken jwtToken)
                {
                    // Extract the role claim
                    var roleClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

                    if (roleClaim != null)
                    {
                        response.Data = roleClaim;
                        response.Success = true;
                    }
                    else
                    {
                        response.Success = false;
                        response.Message = "Role claim not found";
                    }
                }
                else
                {
                    response.Success = false;
                    response.Message = "Invalid token";
                }
            }
            catch (SecurityTokenExpiredException)
            {
                response.Success = false;
                response.Message = "Token has expired";
            }
            catch (SecurityTokenException)
            {
                response.Success = false;
                response.Message = "Invalid token";
            }
            catch (Exception ex)
            {
                response.Success = false;
                response.Message = ex.Message;
            }

            return response;
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

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration.GetSection("AppSetting:Token").Value));

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
