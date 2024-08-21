using AutoMapper;
using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Service.DTOs.RequestDTOs.ProductVariantDTO;
using Service.Models;
using Service.Services.AuthService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.ProductVariantService
{
    public class ProductVariantService : IProductVariantService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;

        public ProductVariantService(DataContext context, IMapper mapper, IAuthService authService)
        {
            _context = context;
            _mapper = mapper;
            _authService = authService;
        }
        public async Task<ServiceResponse<bool>> AddVariant(Guid productId, AddProductVariantDTO newVariant)
        {
            //check product exist
            var dbProduct = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId && !p.Deleted);
            if (dbProduct == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Product not found"
                };
            }

            //check product type exist
            var dbProductType = await _context.ProductTypes.FirstOrDefaultAsync(pt => pt.Id == newVariant.ProductTypeId);
            if (dbProductType == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Product type not found"
                };
            }

            //check variant exist
            var existingVariant = await _context.ProductVariants
                                        .Where(v => v.ProductId == productId)
                                        .FirstOrDefaultAsync(v => v.ProductTypeId == newVariant.ProductTypeId);

            //if variant exist, deny create variant
            if (existingVariant != null && !existingVariant.Deleted)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Product Variant already exists!"
                };
            }

            var username = _authService.GetUserName();

            //if variant has deleted, restore variant
            if (existingVariant != null && existingVariant.Deleted)
            {
                existingVariant.Deleted = false;
                existingVariant.IsActive = true;
                existingVariant.Price = newVariant.Price;
                existingVariant.OriginalPrice = newVariant.OriginalPrice;

                dbProduct.ModifiedAt = DateTime.Now;
                dbProduct.ModifiedBy = username;

                await _context.SaveChangesAsync();
                return new ServiceResponse<bool>
                {
                    Data = true,
                    Message = "Created Product Variant Successfully!"
                };
            }

            try
            {
                var variant = _mapper.Map<ProductVariant>(newVariant);
                variant.ProductId = productId;
                variant.IsActive = true;


                _context.ProductVariants.Add(variant);
                dbProduct.ModifiedAt = DateTime.Now;
                dbProduct.ModifiedBy = username;

                await _context.SaveChangesAsync();

                return new ServiceResponse<bool>
                {
                    Data = true,
                    Message = "Created Product Variant Successfully!"
                };
            }
            catch (Exception ex)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = $"Error: {ex.Message}"
                };
            }
          
        }

        public async Task<ServiceResponse<ProductVariant>> GetVartiant(Guid productId, Guid productTypeId)
        {
            try
            {
                var variant = await _context.ProductVariants
                                     .Where(v => !v.Deleted && v.ProductId == productId)
                                     .Include(v => v.ProductType)
                                     .FirstOrDefaultAsync(v => v.ProductTypeId == productTypeId);
                if (variant == null)
                {
                    return new ServiceResponse<ProductVariant>
                    {
                        Success = false,
                        Message = "Variant not found"
                    };
                }

                return new ServiceResponse<ProductVariant>
                {
                   Data = variant
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<bool>> SoftDeleteVariant(Guid productTypeId, Guid productId)
        {
            var variant = await _context.ProductVariants
                                          .Where(v => !v.Deleted && v.ProductTypeId == productTypeId)
                                          .FirstOrDefaultAsync(v => v.ProductId == productId);
            var dbProduct = await _context.Products
                                          .Where(v => !v.Deleted)
                                          .FirstOrDefaultAsync(p => p.Id == productId);
            if (variant == null || dbProduct == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Product Variant not found"
                };
            }

            var username = _authService.GetUserName();

            try
            {
                variant.Deleted = true;
                dbProduct.ModifiedAt = DateTime.Now;
                dbProduct.ModifiedBy = username;

                await _context.SaveChangesAsync();

                return new ServiceResponse<bool>
                {
                    Message = "Variant has been deleted"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<bool>> UpdateVariant(Guid productId, UpdateProductVariantDTO updateVariant)
        {
            var dbVariant = await _context.ProductVariants
                                          .Where(v => !v.Deleted && v.ProductTypeId == updateVariant.ProductTypeId)
                                          .FirstOrDefaultAsync(v => v.ProductId == productId);
            var dbProduct = await _context.Products 
                                          .Where(v => !v.Deleted)
                                          .FirstOrDefaultAsync(p => p.Id == productId);
            if (dbVariant == null || dbProduct == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Product Variant not found"
                };
            }

            var username = _authService.GetUserName();

            try
            {
                _mapper.Map(updateVariant, dbVariant);    
                dbProduct.ModifiedAt = DateTime.Now;
                dbProduct.ModifiedBy = username;

                await _context.SaveChangesAsync();

                return new ServiceResponse<bool>
                {
                    Data = true,
                    Message = "Updated Product Variant Successfully!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
