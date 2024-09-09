using Data.Transation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.VnPayService.VnPayTransactionService
{
    public interface IVnPayTransactionService
    {
        public Task<string> BeginTransaction(Guid userId, Guid? voucherId);
        public Task<VnpayTransactions> GetTransaction(string transactionId);
        public Task<bool> CommitTransaction(string transactionId);
        public Task<bool> RollbackTransaction(string transactionId);
    }
}
