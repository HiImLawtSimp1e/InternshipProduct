using AutoMapper;
using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Service.DTOs.RequestDTOs.ProductDTO;
using Service.DTOs.ResponseDTOs;
using Service.DTOs.ResponseDTOs.CustomerProductDTO;
using Service.Models;
using Service.Services.AuthService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.ProductService
{
    public class ProductService : IProductService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;

        public ProductService(DataContext context, IMapper mapper, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
        }
        public async Task<ServiceResponse<bool>> CreateProduct(AddProductDTO newProduct)
        {
            var username = _authService.GetUserName();

            try
            {
                var product = _mapper.Map<Product>(newProduct);
                product.CreatedBy = username;

                // Add product image
                var productImage = new ProductImage
                {
                    ImageUrl = product.ImageUrl,
                    IsActive = true,
                    IsMain = true,
                };
                product.ProductImages.Add(productImage);

                // Add product variant
                var variant = new ProductVariant
                {
                    ProductId = product.Id,
                    ProductTypeId = newProduct.ProductTypeId,
                    Price = newProduct.Price,
                    OriginalPrice = newProduct.OriginalPrice
                };

                product.ProductVariants.Add(variant);
                // Save product
                _context.Products.Add(product);
                await _context.SaveChangesAsync();
                return new ServiceResponse<bool>
                {
                    Data = true,
                    Message = "Created Product Successfully!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<bool>> UpdateProduct(Guid id, UpdateProductDTO updateProduct)
        {
            var dbProduct = await _context.Products
                                  .Include(p => p.ProductVariants)
                                  .FirstOrDefaultAsync(p => p.Id == id);
            if(dbProduct == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Product not found"
                };
            }

            var username = _authService.GetUserName();

            try
            {
                _mapper.Map(updateProduct, dbProduct);
                dbProduct.ModifiedAt = DateTime.Now;
                dbProduct.ModifiedBy = username;

                await _context.SaveChangesAsync();

                return new ServiceResponse<bool>
                {
                    Data = true,
                    Message = "Updated Product Successfully!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<bool>> SoftDeleteProduct(Guid productId)
        {
            var product = await _context.Products.FirstOrDefaultAsync(c => c.Id == productId);
            if (product == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Product not found"
                };
            }

            var username = _authService.GetUserName();

            try
            {
                product.Deleted = true;
                product.ModifiedAt = DateTime.Now;
                product.ModifiedBy = username;

                await _context.SaveChangesAsync();

                return new ServiceResponse<bool>
                {
                    Message = "Product has been deleted"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<PagingParams<List<Product>>>> GetAdminProducts(int page,double pageResults)
        {
            var pageCount = Math.Ceiling(_context.Products.Where(p => !p.Deleted).Count() / pageResults);

            try
            {
                var products = await _context.Products
                   .Where(p => !p.Deleted)
                   .OrderByDescending(p => p.ModifiedAt)
                   .Skip((page - 1) * (int)pageResults)
                   .Take((int)pageResults)                  
                   .Include(p => p.ProductVariants.Where(pv => !pv.Deleted))
                   .ThenInclude(pv => pv.ProductType)
                   .ToListAsync();

                var pagingData = new PagingParams<List<Product>>
                {
                    Result = products,
                    CurrentPage = page,
                    Pages = (int)pageCount,
                    PageResults = (int)pageResults
                };

                return new ServiceResponse<PagingParams<List<Product>>>
                {
                    Data = pagingData,
                    Message = "Successfully!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<Product>> GetAdminSingleProduct(Guid id)
        {
            try
            {
                var product = await _context.Products
                   .Where(p => !p.Deleted)
                   .Include(p => p.ProductVariants.Where(pv => !pv.Deleted))
                   .ThenInclude(pv => pv.ProductType)
                   .Include(p => p.ProductValues.Where(pav => !pav.Deleted))
                   .ThenInclude(pav => pav.ProductAttribute)
                   .Include(p => p.ProductImages.Where(pv => !pv.Deleted))
                   .FirstOrDefaultAsync(p => p.Id == id);
                return new ServiceResponse<Product>
                {
                    Data = product,
                    Message = "Successfully!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<CustomerProductResponseDTO>> GetProductBySlug(string slug)
        {
            try
            {
                var product = await _context.Products
                   .Include(p => p.ProductVariants.Where(pv => pv.IsActive && !pv.Deleted))
                   .ThenInclude(v => v.ProductType)
                   .Include(p => p.ProductValues.Where(pav => pav.IsActive && !pav.Deleted))
                   .ThenInclude(pav => pav.ProductAttribute)
                   .Include(p => p.ProductImages.Where(pi => pi.IsActive && !pi.Deleted))
                   .FirstOrDefaultAsync(p => p.Slug == slug && p.IsActive && !p.Deleted);
                if (product == null)
                {
                    return new ServiceResponse<CustomerProductResponseDTO>
                    {
                        Success = false,
                        Message = "Product not found!!!"
                    };
                }

                var result = _mapper.Map<CustomerProductResponseDTO>(product);

                return new ServiceResponse<CustomerProductResponseDTO>
                {
                    Data = result,
                    Message = "Successfully!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<PagingParams<List<CustomerProductResponseDTO>>>> GetProductsAsync(int page, double pageResults)
        {
            var pageCount = Math.Ceiling(_context.Products.Where(p => !p.Deleted && p.IsActive).Count() / pageResults);
            try
            {
                var products = await _context.Products
                   .Where(p => !p.Deleted && p.IsActive)
                   .OrderByDescending(p => p.ModifiedAt)
                   .Skip((page - 1) * (int)pageResults)
                   .Take((int)pageResults)
                   .Include(p => p.ProductVariants.Where(pv => !pv.Deleted && pv.IsActive))
                   .ThenInclude(pv => pv.ProductType)
                   .ToListAsync();

                var result = _mapper.Map<List<CustomerProductResponseDTO>>(products);

                var pagingData = new PagingParams<List<CustomerProductResponseDTO>>
                {
                    Result = result,
                    CurrentPage = page,
                    Pages = (int)pageCount,
                    PageResults = (int)pageResults
                };

                return new ServiceResponse<PagingParams<List<CustomerProductResponseDTO>>>
                {
                    Data = pagingData,
                    Message = "Successfully!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<PagingParams<List<CustomerProductResponseDTO>>>> GetProductsByCategory(string categorySlug, int page, double pageResults)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Slug == categorySlug);
            if (category == null)
            {
                return new ServiceResponse<PagingParams<List<CustomerProductResponseDTO>>>
                {
                    Success = false,
                    Message = "Category not found."
                };
            }

            var pageCount = Math.Ceiling(_context.Products.Where(p => !p.Deleted && p.IsActive && p.CategoryId == category.Id).Count() / pageResults);

            try
            {
                var products = await _context.Products
                   .Where(p => !p.Deleted && p.IsActive && p.CategoryId == category.Id)
                   .OrderByDescending(p => p.ModifiedAt)
                   .Skip((page - 1) * (int)pageResults)
                   .Take((int)pageResults)
                   .Include(p => p.ProductVariants.Where(pv => !pv.Deleted && pv.IsActive))
                   .ThenInclude(pv => pv.ProductType)
                   .ToListAsync();

                var result = _mapper.Map<List<CustomerProductResponseDTO>>(products);

                var pagingData = new PagingParams<List<CustomerProductResponseDTO>>
                {
                    Result = result,
                    CurrentPage = page,
                    Pages = (int)pageCount,
                    PageResults = (int)pageResults
                };

                return new ServiceResponse<PagingParams<List<CustomerProductResponseDTO>>>
                {
                    Data = pagingData,
                };
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<List<string>>> GetProductSearchSuggestions(string seacrchText)
        {
            var products = await FindProductsBySearchText(seacrchText);

            List<string> result = new List<string>();

            foreach (var product in products)
            {
                if (product.Title.Contains(seacrchText, StringComparison.OrdinalIgnoreCase))
                {
                    result.Add(product.Title);
                }

                if (product.Description != null)
                {
                    var punctuation = product.Description.Where(char.IsPunctuation).Distinct().ToArray();
                    var words = product.Description.Split().Select(w => w.Trim(punctuation));
                    foreach (var word in words)
                    {
                        if (word.Contains(seacrchText, StringComparison.OrdinalIgnoreCase) && !result.Contains(word))
                        {
                            result.Add(word);
                        }
                    }
                }
            }

            return new ServiceResponse<List<string>>
            {
                Data = result
            };
        }

        public async Task<ServiceResponse<PagingParams<List<CustomerProductResponseDTO>>>> SearchProducts(string searchText, int page, double pageResults)
        {
            var pageCount = Math.Ceiling((await FindProductsBySearchText(searchText)).Count / pageResults);


            var products = await _context.Products
                .Where(p => p.Title.ToLower().Contains(searchText.ToLower())
                || p.Description.ToLower().Contains(searchText.ToLower())
                && p.IsActive && !p.Deleted)
                .Include(p => p.ProductVariants)
                .Skip((page - 1) * (int)pageResults)
                .Take((int)pageResults)
                .ToListAsync();

            if (products == null)
            {
                return new ServiceResponse<PagingParams<List<CustomerProductResponseDTO>>>
                {
                    Success = false,
                    Message = "Product not found"
                };
            }

            var result = _mapper.Map<List<CustomerProductResponseDTO>>(products);

            var pagingData = new PagingParams<List<CustomerProductResponseDTO>>
            {
                Result = result,
                CurrentPage = page,
                Pages = (int)pageCount,
                PageResults = (int)pageResults
            };

            return new ServiceResponse<PagingParams<List<CustomerProductResponseDTO>>>
            {
                Data = pagingData,
            };
        }

        private async Task<List<Product>> FindProductsBySearchText(string searchText)
        {
            return await _context.Products
                                .Where(p => p.Title.ToLower().Contains(searchText.ToLower()) ||
                                    p.Description.ToLower().Contains(searchText.ToLower()) &&
                                    p.IsActive && !p.Deleted)
                                .ToListAsync();
        }
    }
}
