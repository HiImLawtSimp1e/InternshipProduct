using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.OrderService
{
    public interface IOrderService
    {
        public Task<ServiceResponse<bool>> PlaceOrder(Guid accountId);
    }
}
