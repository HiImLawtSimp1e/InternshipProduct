using AutoMapper;
using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Service.DTOs.RequestDTOs.ProductAttributeDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.ProductAttributeService
{
    public class ProductAttributeService : IProductAttributeService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ProductAttributeService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<ServiceResponse<bool>> CreateProductAttribute(AddProductAttributeDTO newProductAttribute)
        {
            var attribute = _mapper.Map<ProductAttribute>(newProductAttribute);
            try
            {
                _context.ProductAttributes.Add(attribute);
                await _context.SaveChangesAsync();

                return new ServiceResponse<bool>
                {
                    Message = "Attribute created successfully!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<ServiceResponse<bool>> UpdateProductAttribute(Guid productAttributeId, UpdateProductAttributeDTO updateProductAttribute)
        {
            var dbAttribute = await _context.ProductAttributes.FirstOrDefaultAsync(pa => pa.Id == productAttributeId);
            if (dbAttribute == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Not found attribute"
                };
            }

            _mapper.Map(updateProductAttribute, dbAttribute);
            await _context.SaveChangesAsync();
            return new ServiceResponse<bool>
            {
                Message = "Attribute updated successfully!"
            };
        }

        public async Task<ServiceResponse<bool>> DeleteProductAttribute(Guid productAttributeId)
        {
            var dbAttribute = await _context.ProductAttributes.FirstOrDefaultAsync(pa => pa.Id == productAttributeId);
            if (dbAttribute == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Not found attribute"
                };
            }

            var dbAttributeValue = await _context.ProductValues
                                          .Where(pav => pav.ProductAttributeId == productAttributeId)
                                          .ToListAsync();

            if (dbAttributeValue.Any())
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Cannot delete Attribute because it has associated product values."
                };
            }

            try
            {
                _context.ProductAttributes.Remove(dbAttribute);
                await _context.SaveChangesAsync();

                return new ServiceResponse<bool>
                {
                    Success = true,
                    Message = "Attribute deleted!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<PagingParams<List<ProductAttribute>>>> GetProductAttributes(int page)
        {
            var pageResults = 10f;
            var pageCount = Math.Ceiling(_context.ProductAttributes.Count() / pageResults);
            try
            {

                var attributes = await _context.ProductAttributes
                                              .OrderByDescending(p => p.ModifiedAt)
                                              .Skip((page - 1) * (int)pageResults)
                                              .Take((int)pageResults)
                                              .ToListAsync();
                var pagingData = new PagingParams<List<ProductAttribute>>
                {
                    Result = attributes,
                    CurrentPage = page,
                    Pages = (int)pageCount
                };

                return new ServiceResponse<PagingParams<List<ProductAttribute>>>
                {
                    Data = pagingData,
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<ProductAttribute>> GetProductAttribute(Guid productAttributeId)
        {
            try
            {
                var attribute = await _context.ProductAttributes.FirstOrDefaultAsync(pa => pa.Id == productAttributeId);

                if (attribute == null)
                {
                    return new ServiceResponse<ProductAttribute>
                    {
                        Success = false,
                        Message = "Attribute not found"
                    };
                }

                return new ServiceResponse<ProductAttribute>
                {
                    Data = attribute,
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<List<ProductAttribute>>> GetProductAttributeSelect(Guid productId)
        {
            var dbProduct = await _context.Products
                                    .Include(p => p.ProductValues)
                                    .ThenInclude(pav => pav.ProductAttribute)
                                    .Where(p => !p.Deleted)
                                    .FirstOrDefaultAsync(p => p.Id == productId);

            if (dbProduct == null)
            {
                return new ServiceResponse<List<ProductAttribute>>
                {
                    Success = false,
                    Message = "Product not found"
                };
            }

            var allAttribute = await _context.ProductAttributes.ToListAsync();

            var existingAttributeIds = dbProduct.ProductValues
                                                  .Where(pav => !pav.Deleted && pav.ProductAttribute != null)
                                                  .Select(pav => pav.ProductAttribute.Id)
                                                  .ToList();

            var missingAttribute = allAttribute.Where(pa => !existingAttributeIds
                                                     .Contains(pa.Id))
                                                     .ToList();

            return new ServiceResponse<List<ProductAttribute>>
            {
                Success = true,
                Data = missingAttribute
            };
        }

       
    }
}
