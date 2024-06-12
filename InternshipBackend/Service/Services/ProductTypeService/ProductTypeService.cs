using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Service.DTOs.RequestDTOs.ProductTypeDTO;
using Service.Models;
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

        public ProductTypeService(DataContext context)
        {
            _context = context;
        }
        public async Task<ServiceResponse<List<ProductType>>> CreateProductType(AddProductTypeDTO newProductType)
        {
            var productType = new ProductType
            {
                Name = newProductType.Name,
            };
            try
            {
                _context.ProductTypes.Add(productType);
                await _context.SaveChangesAsync();

                return await GetProductTypes();
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public async Task<ServiceResponse<List<ProductType>>> GetProductTypes()
        {
            try
            {
                var productTypes = await _context.ProductTypes.ToListAsync();
                return new ServiceResponse<List<ProductType>>
                {
                    Data = productTypes,
                    Message = "Successfully!!!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<List<ProductType>>> GetProductTypeSelect(Guid productId)
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
                                                  .Where(pv => !pv.Deleted && pv.IsActive && pv.ProductType != null)
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

        public async Task<ServiceResponse<List<ProductType>>> UpdateProductType(UpdateProductTypeDTO productType)
        {
            var dbProductType = await _context.ProductTypes.FindAsync(productType.Id);
            if (dbProductType == null)
            {
                return new ServiceResponse<List<ProductType>>
                {
                    Success = false,
                    Message = "Product Type not found."
                };
            }

            try
            {
                dbProductType.Name = productType.Name;
                dbProductType.ModifiedAt = DateTime.Now;
                await _context.SaveChangesAsync();

                return await GetProductTypes();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
