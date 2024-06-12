﻿using AutoMapper;
using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Service.DTOs.RequestDTOs.ProductVariantDTO;
using Service.Models;
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

        public ProductVariantService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<ServiceResponse<bool>> AddVariant(Guid productId, AddProductVariantDTO newVariant)
        {
            var dbProduct = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId && !p.Deleted);
            if (dbProduct == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Product not found"
                };
            }

            var dbProductType = await _context.ProductTypes.FirstOrDefaultAsync(pt => pt.Id == newVariant.ProductTypeId);
            if (dbProductType == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Product type not found"
                };
            }

            var existingVariant = await _context.ProductVariants
                                        .Where(v => !v.Deleted && v.ProductId == productId)
                                        .FirstOrDefaultAsync(v => v.ProductTypeId == newVariant.ProductTypeId);
            if (existingVariant != null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Product Variant already exists!"
                };
            }

            try
            {
                var variant = _mapper.Map<ProductVariant>(newVariant);
                variant.ProductId = productId;
                variant.IsActive = true;


                _context.ProductVariants.Add(variant);
                dbProduct.ModifiedAt = DateTime.Now;

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

        public async Task<ServiceResponse<bool>> SoftDeleteVariant(Guid productTypeId, Guid productId)
        {
            var variant = await _context.ProductVariants
                                        .Where(v => !v.Deleted && v.ProductId == productId)
                                        .FirstOrDefaultAsync(v => v.ProductTypeId == productTypeId);
            if (variant == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Variant not found"
                };
            }

            try
            {
                variant.Deleted = true;
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
            try
            {
                _mapper.Map(updateVariant, dbProduct);    
                dbProduct.ModifiedAt = DateTime.UtcNow;

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
