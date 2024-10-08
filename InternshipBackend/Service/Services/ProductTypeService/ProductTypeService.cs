﻿using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Service.DTOs.RequestDTOs.ProductTypeDTO;
using Service.Models;
using Service.Services.AuthService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.ProductTypeService
{
    public class ProductTypeService : IProductTypeService
    {
        private readonly DataContext _context;
        private readonly IAuthService _authService;

        public ProductTypeService(DataContext context, IAuthService authService)
        {
            _context = context;
            _authService = authService;
        }
        public async Task<ServiceResponse<bool>> CreateProductType(AddProductTypeDTO newProductType)
        {
            var username = _authService.GetUserName();

            var productType = new ProductType
            {
                Name = newProductType.Name,
                CreatedBy = username
            };
            try
            {
                _context.ProductTypes.Add(productType);
                await _context.SaveChangesAsync();

                return new ServiceResponse<bool>
                {
                    Success = true,
                    Message = "Product Type created!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public async Task<ServiceResponse<bool>> UpdateProductType(Guid productTypeId, UpdateProductTypeDTO productType)
        {
            var dbProductType = await _context.ProductTypes
                                              .FirstOrDefaultAsync(pt =>  pt.Id == productTypeId);
            if (dbProductType == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Product Type not found."
                };
            }

            var username = _authService.GetUserName();

            try
            {
                dbProductType.Name = productType.Name;
                dbProductType.ModifiedAt = DateTime.Now;
                dbProductType.ModifiedBy = username;

                await _context.SaveChangesAsync();

                return new ServiceResponse<bool>
                {
                    Success = true,
                    Message = "Product Type updated!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<bool>> DeleteProductType(Guid productTypeId)
        {
            var dbProductType = await _context.ProductTypes
                                              .FirstOrDefaultAsync(pt => pt.Id == productTypeId);
            if (dbProductType == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Product Type not found."
                };
            }

            var dbVariants = await _context.ProductVariants
                                           .Where(v => v.ProductTypeId == productTypeId)
                                           .ToListAsync();

            if (dbVariants.Any())
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Cannot delete Product Type because it has associated variants."
                };
            }

            try
            {
                _context.ProductTypes.Remove(dbProductType);
                await _context.SaveChangesAsync();

                return new ServiceResponse<bool>
                {
                    Success = true,
                    Message = "Product Type deleted!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<PagingParams<List<ProductType>>>> GetProductTypes(int page)
        {
            var pageResults = 10f;
            var pageCount = Math.Ceiling(_context.ProductTypes.Count() / pageResults);
            try
            {

                var productTypes = await _context.ProductTypes
                                              .OrderByDescending(p => p.ModifiedAt)
                                              .Skip((page - 1) * (int)pageResults)
                                              .Take((int)pageResults)
                                              .ToListAsync();
                var pagingData = new PagingParams<List<ProductType>>
                {
                    Result = productTypes,
                    CurrentPage = page,
                    Pages = (int)pageCount
                };

                return new ServiceResponse<PagingParams<List<ProductType>>>
                {
                    Data = pagingData,
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<ProductType>> GetProductType(Guid productTypeId)
        {
            try
            {
                var productType = await _context.ProductTypes.FirstOrDefaultAsync(pt => pt.Id == productTypeId);

                if(productType == null)
                {
                    return new ServiceResponse<ProductType>
                    {
                        Success = false,
                        Message = "Not found"
                    };
                }

                return new ServiceResponse<ProductType>
                {
                    Data = productType,
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<List<ProductType>>> GetProductTypesSelectByProduct(Guid productId)
        {
            var dbProduct = await _context.Products
                                    .Include(p => p.ProductVariants)
                                    .ThenInclude(pv => pv.ProductType)
                                    .Where(p => !p.Deleted)
                                    .FirstOrDefaultAsync(p => p.Id == productId);

            if (dbProduct == null)
            {
                return new ServiceResponse<List<ProductType>>
                {
                    Success = false,
                    Message = "Product not found"
                };
            }

            var allProductTypes = await _context.ProductTypes.ToListAsync();

            var existingProductTypeIds = dbProduct.ProductVariants
                                                  .Where(pv => !pv.Deleted && pv.ProductType != null)
                                                  .Select(pv => pv.ProductType.Id)
                                                  .ToList();

            var missingProductTypes = allProductTypes.Where(pt => !existingProductTypeIds
                                                     .Contains(pt.Id))
                                                     .ToList();

            return new ServiceResponse<List<ProductType>>
            {
                Success = true,
                Data = missingProductTypes
            };
        }

        public async Task<ServiceResponse<List<ProductType>>> GetProductTypesSelect()
        {
            var types = await _context.ProductTypes
                                  .Where(pt => !pt.Deleted)
                                  .ToListAsync();
            return new ServiceResponse<List<ProductType>>
            {
                Success = true,
                Data = types
            };
        }
    }
}
