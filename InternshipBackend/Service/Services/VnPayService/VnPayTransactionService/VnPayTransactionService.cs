using Data.Context;
using Data.Transation;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.VnPayService.VnPayTransactionService
{
    public class VnPayTransactionService : IVnPayTransactionService
    {
        private readonly DataContext _context;

        public VnPayTransactionService(DataContext context)
        {
            _context = context;
        }
        public async Task<string> BeginTransaction(Guid userId, Guid? voucherId)
        {
            var trans = new VnpayTransactions
            {
                TransactionId = GenerateTransactionId(),
                UserId = userId,
                VoucherId = voucherId,
                Status = "Pending",
                CreateAt = DateTime.Now,
            };

            _context.VnpayTransactions.Add(trans);
            await _context.SaveChangesAsync();

            return trans.TransactionId;

        }

        public async Task<VnpayTransactions> GetTransaction(string transactionId)
        {
            var trans = await _context.VnpayTransactions.FirstOrDefaultAsync(x => x.TransactionId == transactionId);

            return trans;
        }

        public async Task<bool> CommitTransaction(string transactionId)
        {
            var trans = await _context.VnpayTransactions.FirstOrDefaultAsync(x => x.TransactionId == transactionId);

            if(trans == null)
            {
                return false;
            }

            _context.VnpayTransactions.Remove(trans);
            await _context.SaveChangesAsync();
            
            return true;
        }

        public async Task<bool> RollbackTransaction(string transactionId)
        {
            var trans = await _context.VnpayTransactions.FirstOrDefaultAsync(x => x.TransactionId == transactionId);

            if (trans == null)
            {
                return false;
            }

            _context.VnpayTransactions.Remove(trans);
            await _context.SaveChangesAsync();

            return true;
        }

        private string GenerateTransactionId()
        {
            return DateTime.Now.Ticks.ToString();
        }
    }
}
