using AutoMapper;
using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Service.DTOs.RequestDTOs.StoreCartDTO;
using Service.DTOs.ResponseDTOs.CustomerCartItemsDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.CartService
{
    public class CartService : ICartService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public CartService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<ServiceResponse<List<CustomerCartItemsDTO>>> GetCartItems(Guid accountId)
        {
            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.AccountId == accountId);

            if (customer == null)
            {
                return new ServiceResponse<List<CustomerCartItemsDTO>>
                {
                    Success = false,
                    Message = "You need to log in"
                };
            }

            var result = new ServiceResponse<List<CustomerCartItemsDTO>>
            {
                Data = new List<CustomerCartItemsDTO>()
            };

            var dbCart = await _context.Carts.FirstOrDefaultAsync(c => c.CustomerId == customer.Id);

            // If customer cart doesn't exist, create new cart
            if (dbCart == null)
            {
                var newCart = new Cart
                {
                    Id = Guid.NewGuid(),
                    CustomerId = customer.Id,
                    CartItems = new List<CartItem>()
                };

                _context.Carts.Add(newCart);
                await _context.SaveChangesAsync();

                return result;
            }

            var items = await _context.CartItems
                                     .Where(ci => ci.CartId == dbCart.Id)
                                     .ToListAsync();

            if (items == null)
            {
                return result;
            }         

            foreach (var item in items)
            {
                var product = await _context.Products
                    .Where(p => p.Id == item.ProductId)
                    .FirstOrDefaultAsync();

                if (product == null)
                {
                    continue;
                }

                var productVariant = await _context.ProductVariants
                    .Where(v => v.ProductId == item.ProductId
                        && v.ProductTypeId == item.ProductTypeId)
                    .Include(v => v.ProductType)
                    .FirstOrDefaultAsync();

                if (productVariant == null)
                {
                    continue;
                }

                var cartProduct = new CustomerCartItemsDTO
                {
                    ProductId = product.Id,
                    ProductTitle = product.Title,
                    ImageUrl = product.ImageUrl,
                    Price = productVariant.Price,
                    ProductTypeId = productVariant.ProductTypeId,
                    ProductTypeName = productVariant.ProductType.Name,
                    Quantity = item.Quantity
                };

                result.Data.Add(cartProduct);
            }

            return result;
        }

        public async Task<ServiceResponse<bool>> StoreCartItems(Guid accountId, List<StoreCartItemDTO> items)
        {
            var dbCustomer = await _context.Customers.FirstOrDefaultAsync(c => c.AccountId == accountId);

            if (dbCustomer == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "You need to log in"
                };
            }

            // Map DTOs to Entity
            var cartItems = _mapper.Map<List<CartItem>>(items);

            var dbCart = await _context.Carts.Include(c => c.CartItems)
                                             .FirstOrDefaultAsync(c => c.CustomerId == dbCustomer.Id);

            // If customer cart doesn't exist, create new cart
            if (dbCart == null)
            {
                dbCart = new Cart
                {
                    Id = Guid.NewGuid(),
                    CustomerId = dbCustomer.Id,
                    CartItems = new List<CartItem>()
                };
                _context.Carts.Add(dbCart);
            }

            if (cartItems != null)
            {
                foreach (var cartItem in cartItems)
                {
                    cartItem.CartId = dbCart.Id; // Set CartId for each CartItem

                    // Check if CartItem already exists in Cart
                    var existingCartItem = dbCart.CartItems
                        .FirstOrDefault(ci => ci.ProductId == cartItem.ProductId && ci.ProductTypeId == cartItem.ProductTypeId);

                    if (existingCartItem != null)
                    {
                        // Update the quantity of existing CartItem
                        existingCartItem.Quantity += cartItem.Quantity;
                    }
                    else
                    {
                        // Add new CartItem to the Cart
                        dbCart.CartItems.Add(cartItem);
                    }
                }
            }

            await _context.SaveChangesAsync();

            return new ServiceResponse<bool>
            {
                Data = true,
                Message = "Cart has been updated"
            };
        }

    }
}
