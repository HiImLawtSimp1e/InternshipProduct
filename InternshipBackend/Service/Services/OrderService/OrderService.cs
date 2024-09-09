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
using Service.Services.OrderCommonService;
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
        private readonly IOrderCommonService _orderCommonService;
        private readonly ICartService _cartService;
        private readonly IAuthService _authService;

        public OrderService(DataContext context, IMapper mapper, IOrderCommonService orderCommonService, ICartService cartService, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _orderCommonService = orderCommonService;
            _cartService = cartService;
            _authService = authService;
        }
        #region GetOrdersInformationService

        public async Task<ServiceResponse<PagingParams<List<Order>>>> GetAdminOrders(int page)
        {
            var pageResults = 10f;
            var pageCount = Math.Ceiling(_context.Orders.Count() / pageResults);

            var orders = await _context.Orders
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
            if (order == null)
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
                State = order.State,
                DiscountValue = order.DiscountValue
            };

            return new ServiceResponse<OrderDetailCustomerDTO>
            {
                Data = orderCustomerInfo
            };
        }
        #endregion GetOrdersInformation

        #region AdminManagerOrderService

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

            if (dbOrder.State == OrderState.Cancelled)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Can not update canceled order"
                };
            }

            if (state == OrderState.Cancelled)
            {
                await TurnBackVariantQuantity(orderId);
            }

            var username = _authService.GetUserName();

            dbOrder.State = state;
            dbOrder.ModifiedAt = DateTime.Now;
            dbOrder.ModifiedBy = username;

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
        #endregion AdminManagerOrderService

        #region Customers'OrderService
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

        public async Task<ServiceResponse<CustomerVoucherResponseDTO>> ApplyVoucher(string discountCode)
        {
            var accountId = _authService.GetUserId();

            var customer = await _context.Customers
                                         .Include(c => c.Cart)
                                         .FirstOrDefaultAsync(c => c.AccountId == accountId);

            if (customer == null)
            {
                return new ServiceResponse<CustomerVoucherResponseDTO>
                {
                    Success = false,
                    Message = "You need to log in"
                };
            }

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

        public async Task<ServiceResponse<bool>> CancelOrder(Guid orderId)
        {
            var order = await _context.Orders
                                   .Where(o => o.State != OrderState.Cancelled)
                                   .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Not found"
                };
            }

            if (order.State == OrderState.Delivered)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Can not cancel delivered order"
                };
            }

            var username = _authService.GetUserName();

            order.State = OrderState.Cancelled;
            order.ModifiedAt = DateTime.Now;
            order.ModifiedBy = username;

            await TurnBackVariantQuantity(orderId);

            await _context.SaveChangesAsync();

            return new ServiceResponse<bool>
            {
                Message = "Canceled order successfully"
            };
        }

        public async Task<ServiceResponse<bool>> PlaceOrder(Guid? voucherId, string? pmOrder)
        {
            var userId = _authService.GetUserId();
            var customer = await _context.Customers
                                         .Include(c => c.Cart)
                                         .FirstOrDefaultAsync(c => c.AccountId == userId);

            if (customer == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "You need to log in"
                };
            }

            var createOrder = await CreateOrder(voucherId, customer, pmOrder);

            if (!createOrder.Success)
            {
                return createOrder;
            }

            return new ServiceResponse<bool>
            {
                Data = true,
                Message = "Place order successfully!"
            };
        }
        #endregion Customers'OrderService

        public async Task<ServiceResponse<bool>> CreateOrder(Guid? voucherId, Customer customer, string pmOrder)
        {
            var address = await _context.Addresses
                                      .Where(a => a.IsMain)
                                      .FirstOrDefaultAsync(a => a.CustomerId == customer.Id);

            var cartItem = (await _cartService.GetCartItemsByAccountId(customer.AccountId)).Data;
            if (cartItem == null || cartItem.Count() == 0)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Empty cart"
                };
            }

            var paymentMethod = await _context.PaymentMethods.FirstOrDefaultAsync(pm => pm.Name == pmOrder);
            if (paymentMethod == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Payment method is empty"
                };
            }

            int totalAmount = 0;

            cartItem.ForEach(ci => totalAmount += ci.Price * ci.Quantity);

            var invoiceCode = _orderCommonService.GenerateInvoiceCode();

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
                variant.Quantity -= ci.Quantity;
                orderItems.Add(item);
            });

            var order = new Order
            {
                CustomerId = customer.Id,
                InvoiceCode = invoiceCode,
                TotalPrice = totalAmount,
                OrderItems = orderItems,
                FullName = address.FullName,
                Email = address.Email,
                Address = address.Address,
                Phone = address.Phone,
                CreatedBy = "Customer",
                PaymentMethod = paymentMethod,
            };


            if (voucherId != null)
            {
                //Check if the voucher is active, not expired, and has remaining quantity or not.
                var voucher = await _context.Vouchers
                                         .Where(v => v.IsActive == true && DateTime.Now > v.StartDate && DateTime.Now < v.EndDate && v.Quantity > 0)
                                         .FirstOrDefaultAsync(v => v.Id == voucherId);
                if (voucher != null)
                {
                    // MinOrderCondition = 0 meaning max min order condition doesn't exist => pass
                    // Order's total amount > voucher's min order condition => pass

                    if (voucher.MinOrderCondition <= 0 || totalAmount > voucher.MinOrderCondition)
                    {
                        var discountValue = _orderCommonService.CalculateDiscountValue(voucher, totalAmount);
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
                Data = true
            };
        }

        private async Task<bool> TurnBackVariantQuantity(Guid orderId)
        {
            var orderItems = await _context.OrderItems
                                      .Where(o => o.OrderId == orderId)
                                      .ToListAsync();

            if (orderItems == null || orderItems.Count() == 0)
            {
                return false;
            }

            orderItems.ForEach(oi =>
            {
                var variant = _context.ProductVariants
                                   .FirstOrDefault(v => v.ProductId == oi.ProductId && v.ProductTypeId == oi.ProductTypeId);

                // Turn back variant quantity
                variant.Quantity += oi.Quantity;
            });

            return true;
        }
    }
}
