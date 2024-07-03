using AutoMapper;
using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Service.DTOs.RequestDTOs.ProductValueDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.ProductValueService
{
    public class ProductValueService : IProductValueService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ProductValueService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<ServiceResponse<bool>> AddAttributeValue(Guid productId, AddProductValueDTO newAttributeValue)
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

            //check product attribute exist
            var dbProductType = await _context.ProductAttributes.FirstOrDefaultAsync(pa => pa.Id == newAttributeValue.ProductAttributeId);
            if (dbProductType == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Product attribute not found"
                };
            }

            //check attribute value exist
            var existingAttributeValue = await _context.ProductValues
                                        .Where(pav => pav.ProductId == productId)
                                        .FirstOrDefaultAsync(pav => pav.ProductAttributeId == newAttributeValue.ProductAttributeId);

            //if attribute value exist, deny create attribute value
            if (existingAttributeValue != null && !existingAttributeValue.Deleted)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Product attribute already exists!"
                };
            }

            //if attribute value has deleted, restore attribute value
            if (existingAttributeValue != null && existingAttributeValue.Deleted)
            {
                existingAttributeValue.Deleted = false;
                existingAttributeValue.Value = newAttributeValue.Value;

                await _context.SaveChangesAsync();
                return new ServiceResponse<bool>
                {
                    Data = true,
                    Message = "Created Product Attribute Successfully!"
                };
            }

            try
            {
                var attributeValue = _mapper.Map<ProductValue>(newAttributeValue);
                attributeValue.ProductId = productId;
                attributeValue.IsActive = true;


                _context.ProductValues.Add(attributeValue);
                dbProduct.ModifiedAt = DateTime.Now;

                await _context.SaveChangesAsync();

                return new ServiceResponse<bool>
                {
                    Data = true,
                    Message = "Created Product Attribute Successfully!"
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

        public async Task<ServiceResponse<ProductValue>> GetAttributeValue(Guid productId, Guid productAttributeId)
        {
            try
            {
                var attributeValue = await _context.ProductValues
                                     .Where(pav => !pav.Deleted && pav.ProductId == productId)
                                     .Include(pav => pav.ProductAttribute)
                                     .FirstOrDefaultAsync(pav => pav.ProductAttributeId == productAttributeId);
                if (attributeValue == null)
                {
                    return new ServiceResponse<ProductValue>
                    {
                        Success = false,
                        Message = "Attribute value not found"
                    };
                }

                return new ServiceResponse<ProductValue>
                {
                    Data = attributeValue
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<bool>> SoftDeleteAttributeValue(Guid productId, Guid productAttributeId)
        {
            var attributeValue = await _context.ProductValues
                                       .Where(pav => !pav.Deleted && pav.ProductId == productId)
                                       .FirstOrDefaultAsync(pav => pav.ProductAttributeId == productAttributeId);
            if (attributeValue == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Attribute value not found"
                };
            }

            try
            {
                attributeValue.Deleted = true;
                await _context.SaveChangesAsync();

                return new ServiceResponse<bool>
                {
                    Message = "Attribute value has been deleted"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<bool>> UpdateAttributeValue(Guid productId, UpdateProductValueDTO updateAttributeValue)
        {
            var dbAttributeValue = await _context.ProductValues
                                        .Where(pav => !pav.Deleted && pav.ProductAttributeId == updateAttributeValue.ProductAttributeId)
                                        .FirstOrDefaultAsync(pav => pav.ProductId == productId);
            var dbProduct = await _context.Products
                                          .Where(p => !p.Deleted)
                                          .FirstOrDefaultAsync(p => p.Id == productId);
            if (dbAttributeValue == null || dbProduct == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Attribute value not found"
                };
            }
            try
            {
                _mapper.Map(updateAttributeValue, dbAttributeValue);
                dbProduct.ModifiedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return new ServiceResponse<bool>
                {
                    Data = true,
                    Message = "Updated Attribute value Successfully!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
