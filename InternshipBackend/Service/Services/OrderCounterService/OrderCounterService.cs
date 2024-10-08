﻿using AutoMapper;
using Data.Context;
using Data.Entities;
using Data.Enums;
using Microsoft.EntityFrameworkCore;
using Service.DTOs.RequestDTOs.OrderCounterDTO;
using Service.DTOs.ResponseDTOs.CustomerVoucherDTO;
using Service.DTOs.ResponseDTOs.OrderCounterDTO;
using Service.Models;
using Service.Services.AuthService;
using Service.Services.OrderCommonService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.OrderCounterService
{
    public class OrderCounterService : IOrderCounterService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        private readonly IOrderCommonService _orderCommonService;

        public OrderCounterService(DataContext context, IMapper mapper, IAuthService authService, IOrderCommonService orderCommonService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
            _orderCommonService = orderCommonService;
        }

        public async Task<ServiceResponse<bool>> PlaceOrderCounter(Guid? voucherId, PlaceOrderCounterDTO newOrderCounter)
        {
            var username = _authService.GetUserName();

            var orderCounterItems = newOrderCounter.OrderItems;

            if (orderCounterItems == null || orderCounterItems.Count() == 0)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Empty order item"
                };
            }

            orderCounterItems.ForEach(oi =>
            {
                var variant = _context.ProductVariants
                                    .FirstOrDefault(v => v.ProductId == oi.ProductId && v.ProductTypeId == oi.ProductTypeId);

                variant.Quantity -= oi.Quantity;
            });

            int totalAmount = 0;

            orderCounterItems.ForEach(oci => totalAmount += oci.Price * oci.Quantity);

            var invoiceCode = _orderCommonService.GenerateInvoiceCode();

            var orderItems = _mapper.Map<List<OrderItem>>(orderCounterItems);

            var order = new Order
            {
                InvoiceCode = invoiceCode,
                FullName = newOrderCounter.FullName,
                Email = newOrderCounter.Email,
                Phone = newOrderCounter.Phone,
                Address = newOrderCounter.Address,
                OrderItems = orderItems,
                TotalPrice = totalAmount,
                State = OrderState.Delivered,
                CreatedBy = username,
                PaymentMethodId = newOrderCounter.PaymentMethodId
            };

            var discountValue = 0;

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
                        discountValue = _orderCommonService.CalculateDiscountValue(voucher, totalAmount);
                        order.DiscountValue = discountValue;
                        order.VoucherId = voucher.Id;
                        voucher.Quantity -= 1;
                    }
                }
            }

            order.TotalAmount = order.TotalPrice - discountValue;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return new ServiceResponse<bool>
            {
                Data = true,
                Message = "Place order counter successfully!"
            };
        }
        public async Task<ServiceResponse<List<OrderCounterCustomerAddressDTO>>> SearchCustomerAddressCards(string searchText)
        {
            var addresses = await _context.Addresses
                .Where(a => a.Email.ToLower().Contains(searchText.ToLower())
                || a.Phone.ToLower().Contains(searchText.ToLower()))
                .Take(10)
                .ToListAsync();

            var result = _mapper.Map<List<OrderCounterCustomerAddressDTO>>(addresses);


            return new ServiceResponse<List<OrderCounterCustomerAddressDTO>>
            {
                Data = result
            };
        }

        public async Task<ServiceResponse<List<OrderItemResponseDTO>>> SearchProducts(string searchText)
        {
            var products = await _context.Products
                .Where(p => p.Title.ToLower().Contains(searchText.ToLower())
                && p.IsActive && !p.Deleted)
                .Include(p => p.ProductVariants.Where(pv => !pv.Deleted))
                .ThenInclude(pv => pv.ProductType)
                .Take(10)
                .ToListAsync();

            if (products == null)
            {
                return new ServiceResponse<List<OrderItemResponseDTO>>
                {
                    Success = false,
                    Message = "Product not found"
                };
            }

            var orderItems = new List<OrderItemResponseDTO>();

            products.ForEach(product =>
            {
                product.ProductVariants.ForEach(variant =>
                {
                    var item = new OrderItemResponseDTO
                    {
                        ProductId = variant.ProductId,
                        ProductTypeId = variant.ProductTypeId,
                        ImageUrl = product.ImageUrl, // Thêm giá trị cho ImageUrl
                        ProductTitle = product.Title,
                        ProductTypeName = variant.ProductType.Name,
                        Price = variant.Price,
                        OriginalPrice = variant.OriginalPrice,
                        Quantity = 1 // Thiết lập giá trị mặc định cho Quantity
                    };
                    orderItems.Add(item);
                });
            });

            return new ServiceResponse<List<OrderItemResponseDTO>>
            {
                Data = orderItems
            };
        }

        public async Task<ServiceResponse<List<PaymentMethod>>> GetPaymentMethodSelect()
        {
            var paymentMethods = await _context.PaymentMethods
                                           .ToListAsync();

            if (paymentMethods == null)
            {
                return new ServiceResponse<List<PaymentMethod>>
                {
                    Success = false,
                    Message = "Missing payment method"
                };
            }

            return new ServiceResponse<List<PaymentMethod>>
            {
                Data = paymentMethods
            };
        }

        public async Task<ServiceResponse<CustomerVoucherResponseDTO>> ApplyVoucher(string discountCode, int totalAmount)
        {
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
    }
}
