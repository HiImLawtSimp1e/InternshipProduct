using Data.Context;
using Data.Entities;
using Data.Enums;
using Microsoft.EntityFrameworkCore;
using Service.DTOs.ResponseDTOs.CustomerCartItemsDTO;
using Service.DTOs.ResponseDTOs.OrerDetailDTO;
using Service.Models;
using Service.Services.AuthService;
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
        private readonly IAuthService _authService;

        public OrderService(DataContext context, ICartService cartService, IAuthService authService)
        {
            _context = context;
            _cartService = cartService;
            _authService = authService;
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

        public async Task<ServiceResponse<List<OrderItemDTO>>> GetOrderItems(Guid orderId)
        {
            var items = await _context.OrderItems 
                                    .Where(oi => oi.OrderId == orderId)
                                    .ToListAsync();

            var result = new ServiceResponse<List<OrderItemDTO>>
            {
                Data = new List<OrderItemDTO>()
            };

            foreach (var item in items)
            {
                var product = await _context.Products
                    .Where(p => p.Id == item.ProductId)
                    .FirstOrDefaultAsync();

                if (product == null)
                {
                    continue;
                }

                var cartProduct = new OrderItemDTO
                {
                    ProductId = item.ProductId,
                    ProductTitle = item.ProductTitle,
                    ImageUrl = product.ImageUrl,
                    ProductTypeId = item.ProductTypeId,
                    Price = item.Price,
                    OriginalPrice = item.OriginalPrice,
                    ProductTypeName = item.ProductTypeName,
                    Quantity = item.Quantity
                };

                result.Data.Add(cartProduct);
            }

            return result;
        }

        public async Task<ServiceResponse<OrderDetailCustomerDTO>> GetOrderCustomerInfo(Guid orderId)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == orderId);
            if(order == null)
            {
                return new ServiceResponse<OrderDetailCustomerDTO>
                {
                    Success = false,
                    Message = "Not found order"
                };
            }

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Id == order.CustomerId);

            if (customer == null)
            {
                return new ServiceResponse<OrderDetailCustomerDTO>
                {
                    Success = false,
                    Message = "Not found customer"
                };
            }

            var orderCustomerInfo = new OrderDetailCustomerDTO
            {
                Id = customer.Id,
                FullName = order.FullName,
                Email = order.Email,
                Address = order.Address,
                Phone = order.Phone,
                InvoiceCode = order.InvoiceCode,
                OrderCreatedAt = order.CreatedAt
            };

            return new ServiceResponse<OrderDetailCustomerDTO>
            {
                Data = orderCustomerInfo
            };
        }

        public async Task<ServiceResponse<bool>> UpdateOrderState(Guid orderId, OrderState state)
        {
            if (!Enum.IsDefined(typeof(OrderState), state))
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Invalid state"
                };
            }

            var dbOrder = await _context.Orders.FirstOrDefaultAsync(o => o.Id == orderId);
            if (dbOrder == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Not found order"
                };
            }
            dbOrder.State = state;
            await _context.SaveChangesAsync();
            return new ServiceResponse<bool>
            {
                Data = true,
                Message = "Updated order state successfully!"
            };
        }

        public async Task<ServiceResponse<int>> GetOrderState(Guid orderId)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == orderId);
            if (order == null)
            {
                return new ServiceResponse<int>
                {
                    Success = false,
                    Message = "Not found order"
                };
            }
            return new ServiceResponse<int>
            {
                Data = (int)order.State
            };
        }

        public async Task<ServiceResponse<PagingParams<List<Order>>>> GetCustomerOrders(int page)
        {
            var accountId = _authService.GetUserId();

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.AccountId == accountId);

            if (customer == null)
            {
                return new ServiceResponse<PagingParams<List<Order>>>
                {
                    Success = false,
                    Message = "You need to log in"
                };
            }

            var pageResults = 10f;
            var pageCount = Math.Ceiling(_context.Orders.Count() / pageResults);

            var orders = await _context.Orders
                                   .Where(o => o.CustomerId == customer.Id)
                                   .OrderByDescending(o => o.CreatedAt)
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

        public async Task<ServiceResponse<bool>> PlaceOrder()
        {
            var accountId = _authService.GetUserId();

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

            var cartItem = (await _cartService.GetCartItems()).Data;
            if(cartItem == null || cartItem.Count() == 0)
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
                var product = _context.Products.FirstOrDefault(p => p.Id == ci.ProductId);
                var variant = _context.ProductVariants
                                    .Include(v => v.ProductType)
                                    .FirstOrDefault(v => v.ProductId == ci.ProductId && v.ProductTypeId == ci.ProductTypeId);

                var item = new OrderItem
                {
                    ProductId = ci.ProductId,
                    ProductTypeId = ci.ProductTypeId,
                    Quantity = ci.Quantity,
                    Price = ci.Price,
                    OriginalPrice = variant.OriginalPrice,
                    ProductTypeName = variant.ProductType.Name,
                    ProductTitle = product.Title,
                };
                orderItems.Add(item);
            });

            var order = new Order
            {
                CustomerId = customer.Id,
                InvoiceCode = GenerateInvoiceCode(),
                TotalPrice = totalAmount,
                OrderItems = orderItems,
                FullName = customer.FullName,
                Email = customer.Email,
                Address = customer.Address,
                Phone = customer.Phone,
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
