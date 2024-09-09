using AutoMapper;
using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Scaffolding.Metadata;
using Service.DTOs.RequestDTOs.StoreCartDTO;
using Service.DTOs.ResponseDTOs.CustomerCartItemsDTO;
using Service.Models;
using Service.Services.AuthService;
using System;
using System.Collections.Generic;
using System.Data.SqlTypes;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.CartService
{
    public class CartService : ICartService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;

        public CartService(DataContext context, IMapper mapper, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
        }
        public async Task<int> GetCartTotalAmountAsync()
        {
            int totalAmount = 0;
            var cartItem = (await GetCartItems()).Data;
            if (cartItem == null)
            {
                return 0;
            }
            cartItem.ForEach(ci => totalAmount += ci.Price * ci.Quantity);
            return totalAmount;

        }
        public async Task<ServiceResponse<bool>> AddToCart(StoreCartItemDTO newItem)
        {
            var accountId = _authService.GetUserId();

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.AccountId == accountId);

            if (customer == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "You need to log in"
                };
            }

            var dbCart = await GetCustomerCart(customer.Id);

            var sameItem = await _context.CartItems
                                            .FirstOrDefaultAsync(ci => ci.ProductId == newItem.ProductId && ci.ProductTypeId == newItem.ProductTypeId && ci.CartId == dbCart.Id);

            if (sameItem == null)
            {
                var item = _mapper.Map<CartItem>(newItem);
                item.CartId = dbCart.Id;
                _context.CartItems.Add(item);
            }
            else
            {
                sameItem.Quantity += newItem.Quantity;
            }

            await _context.SaveChangesAsync();

            return new ServiceResponse<bool>
            {
                Data = true,
                Message = "Added to cart successfuly!"
            };
        }

        public async Task<ServiceResponse<bool>> UpdateQuantity(StoreCartItemDTO updateItem)
        {
            var accountId = _authService.GetUserId();

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.AccountId == accountId);

            if (customer == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "You need to log in"
                };
            }

            var dbCart = await GetCustomerCart(customer.Id);

            var dbItem = await _context.CartItems
                                            .FirstOrDefaultAsync(ci => ci.ProductId == updateItem.ProductId && ci.ProductTypeId == updateItem.ProductTypeId && ci.CartId == dbCart.Id);

            if (dbItem == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Not found cart item"
                };
            }

            dbItem.Quantity = updateItem.Quantity;
            await _context.SaveChangesAsync();

            return new ServiceResponse<bool>
            {
                Data = true,
                Message = "Update quantity successfully"
            };
        }

        public async Task<ServiceResponse<bool>> RemoveFromCart(Guid productId, Guid productTypeId)
        {
            var accountId = _authService.GetUserId();

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.AccountId == accountId);

            if (customer == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "You need to log in"
                };
            }

            var dbCart = await _context.Carts.FirstOrDefaultAsync(c => c.CustomerId == customer.Id);

            if (dbCart == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Not found cart"
                };
            }

            var item = await _context.CartItems
                                          .FirstOrDefaultAsync(ci => ci.ProductId == productId && ci.ProductTypeId == productTypeId && ci.CartId == dbCart.Id);

            if (item == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Not found cart item"
                };
            }

            _context.CartItems.Remove(item);
            await _context.SaveChangesAsync();
            return new ServiceResponse<bool>
            {
                Data = true,
                Message = "Cart item has removed"
            };
        }

        public async Task<ServiceResponse<List<CustomerCartItemsDTO>>> GetCartItems()
        {
            var accountId = _authService.GetUserId();

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
                await CreateCustomerCart(customer.Id);
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
                    OriginalPrice = productVariant.OriginalPrice,
                    ProductTypeId = productVariant.ProductTypeId,
                    ProductTypeName = productVariant.ProductType.Name,
                    Quantity = item.Quantity
                };

                result.Data.Add(cartProduct);
            }

            return result;
        }

        public async Task<ServiceResponse<bool>> StoreCartItems(List<StoreCartItemDTO> items)
        {
            var accountId = _authService.GetUserId();

            var customer = await _context.Customers.FirstOrDefaultAsync(c => c.AccountId == accountId);

            if (customer == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "You need to log in"
                };
            }

            // Map DTOs to Entity
            var cartItems = _mapper.Map<List<CartItem>>(items);

            var dbCart = await GetCustomerCart(customer.Id);

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

        public async Task<ServiceResponse<List<CustomerCartItemsDTO>>> GetCartItemsByAccountId(Guid? accountId)
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
                await CreateCustomerCart(customer.Id);
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
                    OriginalPrice = productVariant.OriginalPrice,
                    ProductTypeId = productVariant.ProductTypeId,
                    ProductTypeName = productVariant.ProductType.Name,
                    Quantity = item.Quantity
                };

                result.Data.Add(cartProduct);
            }

            return result;

        }

        private async Task<Cart> CreateCustomerCart(Guid customerId)
        {
            var newCart = new Cart
            {
                Id = Guid.NewGuid(),
                CustomerId = customerId,
                CartItems = new List<CartItem>()
            };

            _context.Carts.Add(newCart);
            await _context.SaveChangesAsync();
            return newCart;
        }

        private async Task<Cart> GetCustomerCart(Guid customerId)
        {
            var dbCart = await _context.Carts.FirstOrDefaultAsync(c => c.CustomerId == customerId);

            if (dbCart == null)
            {
                // If customer cart doesn't exist, create new cart
                dbCart = await CreateCustomerCart(customerId);
            }

            return dbCart;
        }
    }
}
