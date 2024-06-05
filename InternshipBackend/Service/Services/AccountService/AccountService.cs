using Data.Context;
using Data.Entities;
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

namespace Service.Services.AccountService
{
    public class AccountService : IAccountService
    {
        private readonly DataContext _context;

        public AccountService(DataContext context)
        {
            _context = context;
        }
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
                var account = new Account
                {
                    AccountName = registerDTO.AccountName
                };
                var password = registerDTO.Password;

                //check account name exist
                if (await AccountExists(account.AccountName))
                {
                    return new ServiceResponse<int>
                    {
                        Success = false,
                        Message = "User already exists"
                    };
                }

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

        // generate jwt
        private string CreateToken(Account account)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, account.Id.ToString()),
                new Claim(ClaimTypes.Name, account.AccountName),
                new Claim(ClaimTypes.Role, account.Role),
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
    }
}
