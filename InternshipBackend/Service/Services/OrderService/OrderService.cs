using AutoMapper;
using Data.Context;
using Data.Entities;
using Data.Enums;
using Microsoft.EntityFrameworkCore;
using Service.DTOs.ResponseDTOs.CustomerCartItemsDTO;
using Service.DTOs.ResponseDTOs.CustomerVoucherDTO;
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
        private readonly IMapper _mapper;
        private readonly ICartService _cartService;
        private readonly IAuthService _authService;

        public OrderService(DataContext context,IMapper mapper, ICartService cartService, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
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

        public async Task<ServiceResponse<OrderDetailCustomerDTO>> GetOrderDetailInfo(Guid orderId)
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

            var orderCustomerInfo = new OrderDetailCustomerDTO
            {
                Id = order.Id,
                FullName = order.FullName,
                Email = order.Email,
                Address = order.Address,
                Phone = order.Phone,
                InvoiceCode = order.InvoiceCode,
                OrderCreatedAt = order.CreatedAt,
                DiscountValue = order.DiscountValue
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
            var pageCount = Math.Ceiling(_context.Orders.Where(o => o.CustomerId == customer.Id).Count() / pageResults);

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

        public async Task<ServiceResponse<bool>> PlaceOrder(Guid? voucherId)
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

            var address = await _context.Addresses
                                      .Where(a => a.IsMain)
                                      .FirstOrDefaultAsync(a => a.CustomerId == customer.Id);

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
                FullName = address.FullName,
                Email = address.Email,
                Address = address.Address,
                Phone = address.Phone,
            };

            if(voucherId != null)
            {
                //Check if the voucher is active, not expired, and has remaining quantity or not.
                var voucher = await _context.Vouchers
                                         .Where(v => v.IsActive == true && DateTime.Now > v.StartDate && DateTime.Now < v.EndDate && v.Quantity > 0)
                                         .FirstOrDefaultAsync(v => v.Id == voucherId);
                if(voucher != null)
                {
                    // MinOrderCondition = 0 meaning max min order condition doesn't exist => pass
                    // Order's total amount > voucher's min order condition => pass

                    if (voucher.MinOrderCondition <= 0 || totalAmount > voucher.MinOrderCondition)
                    {
                        var discountValue = CaculateDiscountValue(voucher, totalAmount);
                        order.DiscountValue = discountValue;
                        order.VoucherId = voucher.Id;
                        voucher.Quantity -= 1;
                    }
                }
            }

            _context.Orders.Add(order);
            _context.CartItems.RemoveRange(_context.CartItems.Where(ci => ci.CartId == customer.Cart.Id));

            await _context.SaveChangesAsync();
            return new ServiceResponse<bool>
            {
                Data = true,
                Message = "Place order successfully!"
            };
        }

        public async Task<ServiceResponse<CustomerVoucherResponseDTO>> ApplyVoucher(string discountCode)
        {
            var totalAmount = await _cartService.GetCartTotalAmountAsync();
            if (totalAmount == 0)
            {
                return new ServiceResponse<CustomerVoucherResponseDTO>
                {
                    Success = false,
                    Message = "Empty Cart"
                };
            }

            //Check if the voucher is active, not expired, and has remaining quantity or not.
            var voucher = await _context.Vouchers
                                           .Where(v => v.IsActive == true && DateTime.Now > v.StartDate && DateTime.Now < v.EndDate && v.Quantity > 0)
                                           .FirstOrDefaultAsync(v => v.Code == discountCode);
            if (voucher == null)
            {
                return new ServiceResponse<CustomerVoucherResponseDTO>
                {
                    Success = false,
                    Message = "Discount code is incorrect or has expired"
                };
            }
            else if(IsVoucherUsed(voucher.Id)){
                return new ServiceResponse<CustomerVoucherResponseDTO>
                {
                    Success = false,
                    Message = "Discount code has been used"
                };
            }
            else
            {
                // MinOrderCondition = 0 meaning max min order condition doesn't exist
                if (voucher.MinOrderCondition > 0 && totalAmount < voucher.MinOrderCondition)
                {
                    return new ServiceResponse<CustomerVoucherResponseDTO>
                    {
                        Success = false,
                        Message = string.Format("The voucher is only applicable for orders with a value greater than {0}", voucher.MinOrderCondition)
                    };
                }
                
                var result = _mapper.Map<CustomerVoucherResponseDTO>(voucher);

                return new ServiceResponse<CustomerVoucherResponseDTO> 
                { 
                    Data = result
                };
            }

        }

        //Generate random invoice code
        private string GenerateInvoiceCode()
        {
            return $"INV-{DateTime.Now:yyyyMMddHHmmssfff}-{new Random().Next(1000, 9999)}";
        }

        //Logical: Each account is allowed to use one voucher code only once
        private bool IsVoucherUsed(Guid voucherId)
        {
            var accountId = _authService.GetUserId();
            var customer = _context.Customers.FirstOrDefault(c => c.AccountId == accountId);
            if (customer == null)
            {
                return true;
            }
            var isUsedVoucher = _context.Orders.FirstOrDefault(o => o.CustomerId == customer.Id && o.VoucherId == voucherId);
            return isUsedVoucher != null;
        }

        private int CaculateDiscountValue(Voucher voucher, int totalAmount)
        {
            int result = 0;
            if(voucher.IsDiscountPercent)
            {
                var discountValue = (int)(totalAmount * (voucher.DiscountValue / 100));

                // MaxDiscountValue = 0 meaning max discount value doesn't exist
                if (voucher.MaxDiscountValue > 0)
                {
                    result = (discountValue > voucher.MaxDiscountValue) ? voucher.MaxDiscountValue : discountValue;
                }
                else
                {
                    result = discountValue;
                }
            }
            else
            {
                result = (int)voucher.DiscountValue;
            }
            return result;
        }
    }
}
