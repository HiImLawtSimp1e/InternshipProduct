using AutoMapper;
using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Service.DTOs.RequestDTOs.ProductDTO;
using Service.DTOs.ResponseDTOs;
using Service.DTOs.ResponseDTOs.CustomerProductDTO;
using Service.Models;
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

        public ProductService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<ServiceResponse<List<Product>>> CreateProduct(AddProductDTO newProduct)
        {
            try 
            {
                var product = _mapper.Map<Product>(newProduct);
                _context.Products.Add(product);
                await _context.SaveChangesAsync();
                return await GetAdminProducts();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<List<Product>>> UpdateProduct(UpdateProductDTO updateProduct)
        {
            var dbProduct = await _context.Products
                                  .Include(p => p.ProductVariants)
                                  .FirstOrDefaultAsync(p => p.Id == updateProduct.Id);
            if(dbProduct == null)
            {
                return new ServiceResponse<List<Product>>
                {
                    Success = false,
                    Message = "Product not found"
                };
            }
            dbProduct.ModifiedAt = DateTime.Now;
            try
            {
                _mapper.Map(updateProduct, dbProduct);
                foreach (var variantDto in updateProduct.ProductVariants)
                {
                    var dbProductVariant = dbProduct.ProductVariants
                                                    .FirstOrDefault(pv => pv.ProductId == variantDto.ProductId && pv.ProductTypeId == variantDto.ProductTypeId);
                    if (dbProductVariant == null)
                    {
                        var newProductVariant = _mapper.Map<ProductVariant>(variantDto);
                    }
                    else
                    {
                        _mapper.Map(variantDto, dbProductVariant);
                    }
                    await _context.SaveChangesAsync();              
                }
                return await GetAdminProducts();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<List<Product>>> SoftDeleteProduct(Guid productId)
        {
            var product = await _context.Products.FirstOrDefaultAsync(c => c.Id == productId);
            if (product == null)
            {
                return new ServiceResponse<List<Product>>
                {
                    Success = false,
                    Message = "Category not found"
                };
            }

            try
            {
                product.Deleted = true;
                await _context.SaveChangesAsync();

                return await GetAdminProducts();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<List<Product>>> GetAdminProducts()
        {
            try
            {
                var products = await _context.Products
                   .Where(p => !p.Deleted)
                   .Include(p => p.ProductVariants.Where(pv => !pv.Deleted))
                   .ThenInclude(pv => pv.ProductType)
                   .ToListAsync();
                return new ServiceResponse<List<Product>>
                {
                    Data = products,
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

        public async Task<ServiceResponse<List<CustomerProductResponseDTO>>> GetProductsAsync()
        {
            try
            {
                var products = await _context.Products
                   .Where(p => !p.Deleted && p.IsActive)
                   .Include(p => p.ProductVariants.Where(pv => !pv.Deleted && pv.IsActive))
                   .ThenInclude(pv => pv.ProductType)
                   .ToListAsync();
                var result = _mapper.Map<List<CustomerProductResponseDTO>>(products);
                return new ServiceResponse<List<CustomerProductResponseDTO>>
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

        public async Task<ServiceResponse<List<CustomerProductResponseDTO>>> GetProductsByCategory(string categorySlug)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.Slug == categorySlug);
            if (category == null)
            {
                return new ServiceResponse<List<CustomerProductResponseDTO>>
                {
                    Success = false,
                    Message = "Category not found."
                };
            }

            try
            {
                var products = await _context.Products
                   .Where(p => !p.Deleted && p.IsActive && p.CategoryId == category.Id)
                   .Include(p => p.ProductVariants.Where(pv => !pv.Deleted && pv.IsActive))
                   .ThenInclude(pv => pv.ProductType)
                   .ToListAsync();
                var result = _mapper.Map<List<CustomerProductResponseDTO>>(products);
                return new ServiceResponse<List<CustomerProductResponseDTO>>
                {
                    Data = result,
                    Message = "Successfully!"
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

        public async Task<ServiceResponse<ProductSearchResult>> SearchProducts(string searchText, int page)
        {
            var pageResults = 2f;
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
                return new ServiceResponse<ProductSearchResult>
                {
                    Success = false,
                    Message = "Product not found"
                };
            }
            return new ServiceResponse<ProductSearchResult>
            {
                Data = new ProductSearchResult
                {
                    Products = products,
                    CurrentPage = page,
                    Pages = (int)pageCount
                },
                Message = "Successfully!"
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
