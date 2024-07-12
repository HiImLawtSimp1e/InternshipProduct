using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Service.Models;
using Service.Services.CartService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.OrderService
{
    public class OrderService : IOrderService
    {
        private readonly DataContext _context;
        private readonly ICartService _cartService;

        public OrderService(DataContext context, ICartService cartService)
        {
            _context = context;
            _cartService = cartService;
        }

        public async Task<ServiceResponse<PagingParams<List<Order>>>> GetAdminOrders(int page)
        {
            var pageResults = 10f;
            var pageCount = Math.Ceiling(_context.Orders.Count() / pageResults);

            var orders =  await _context.Orders
                                   .OrderByDescending(p => p.ModifiedAt)
                                   .Skip((page - 1) * (int)pageResults)
                                   .Take((int)pageResults)
                                   .ToListAsync();

            var pagingData = new PagingParams<List<Order>>
            {
                Result = orders,
                CurrentPage = page,
                Pages = (int)pageCount
            };

            return new ServiceResponse<PagingParams<List<Order>>>
            {
                Data = pagingData
            };
        }

        public async Task<ServiceResponse<bool>> PlaceOrder(Guid accountId)
        {
            var customer = await _context.Customers
                                         .Include(c => c.Cart)
                                         .FirstOrDefaultAsync(c => c.AccountId == accountId);

            if (customer == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "You need to log in"
                };
            }

            var cartItem = (await _cartService.GetCartItems(accountId)).Data;
            if(cartItem == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Empty cart"
                };
            }

            int totalAmount = 0;

            cartItem.ForEach(ci => totalAmount += ci.Price * ci.Quantity);

            var orderItems = new List<OrderItem>();

            cartItem.ForEach(ci =>
            {
                var item = new OrderItem
                {
                    ProductId = ci.ProductId,
                    ProductTypeId = ci.ProductTypeId,
                    Quantity = ci.Quantity,
                    TotalPrice = ci.Quantity * ci.Price,
                };
                orderItems.Add(item);
            });

            var order = new Order
            {
                CustomerId = customer.Id,
                InvoiceCode = GenerateInvoiceCode(),
                TotalPrice = totalAmount,
                OrderItems = orderItems
            };

            _context.Orders.Add(order);
            _context.CartItems.RemoveRange(_context.CartItems.Where(ci => ci.CartId == customer.Cart.Id));

            await _context.SaveChangesAsync();
            return new ServiceResponse<bool>
            {
                Data = true,
                Message = "Place order successfully!"
            };
        }

        private string GenerateInvoiceCode()
        {
            return $"INV-{DateTime.Now:yyyyMMddHHmmssfff}-{new Random().Next(1000, 9999)}";
        }
    }
}
