using AutoMapper;
using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Service.DTOs.RequestDTOs.ProductImageDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Helpers;
using static System.Net.Mime.MediaTypeNames;

namespace Service.Services.ProductImageService
{
    public class ProductImageService : IProductImageService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ProductImageService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<ServiceResponse<bool>> CreateProductImage(AddProductImageDTO newImage)
        {
            try
            {
                var image = _mapper.Map<ProductImage>(newImage);

                if (image.IsMain == true)
                {
                    var mainImage = _context.ProductImages
                                         .Where(pi => pi.ProductId == image.ProductId && !pi.Deleted)
                                         .FirstOrDefault(pi => pi.IsMain);
                    var dbProduct = await _context.Products
                                           .Where(p => !p.Deleted)
                                           .FirstOrDefaultAsync(p => p.Id == image.ProductId);
                    if (mainImage != null && dbProduct != null)
                    {
                        mainImage.IsMain = false;
                        dbProduct.ImageUrl = image.ImageUrl;
                    }
                }

                _context.ProductImages.Add(image);
                await _context.SaveChangesAsync();
                return new ServiceResponse<bool> 
                { 
                    Data = true, 
                    Message = "Created image successfully!" 
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<bool>> DeleteProductImage(Guid id)
        {
            var dbImage = await _context.ProductImages
                                      .Where(pi => !pi.Deleted)
                                      .FirstOrDefaultAsync(pi => pi.Id == id);
            if (dbImage == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Image not found"
                };
            }

            if(dbImage.IsMain == true)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Cannot delete main image"
                };
            }

            var someImageElse = await _context.ProductImages
                                     .Where(pi => pi.Id != dbImage.Id && !pi.Deleted)
                                     .FirstOrDefaultAsync(pi => pi.ProductId == dbImage.ProductId);
            if (someImageElse == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Cannot delete default image"
                };
            }

            try
            {
                dbImage.Deleted = true;
                await _context.SaveChangesAsync();
                return new ServiceResponse<bool>
                {
                    Data = true,
                    Message = "Deleted image successfully!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<bool>> UpdateProductImage(Guid id, UpdateProductImageDTO updateImage)
        {
            var dbImage = await _context.ProductImages
                                      .Where(pi => !pi.Deleted)
                                      .FirstOrDefaultAsync(pi => pi.Id == id);
            if(dbImage == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Image not found"
                };
            }

            //Check if unactive main image
            if (updateImage.IsActive == false && dbImage.IsMain == true)
            {
                updateImage.IsMain = false;
                var someImageElse = await _context.ProductImages
                                      .Where(pi => pi.Id != dbImage.Id && !pi.Deleted)
                                      .FirstOrDefaultAsync(pi => pi.ProductId == dbImage.ProductId);
                if(someImageElse != null)
                {
                    someImageElse.IsMain = true;
                }
                else
                {
                    return new ServiceResponse<bool>
                    {
                        Success = false,
                        Message = "Can not unactive default image"
                    };
                }
            }
            try
            {
                _mapper.Map(updateImage, dbImage);
                // Check if image has mapped is main image
                if (dbImage.IsMain == true)
                {
                    var mainImage = _context.ProductImages
                                         .Where(pi => pi.ProductId == dbImage.ProductId && !pi.Deleted)
                                         .FirstOrDefault(pi => pi.IsMain);
                    // If it has already main image in db => set that image is not main 
                    if (mainImage != null)
                    {
                        mainImage.IsMain = false;
                    }
                }
                await _context.SaveChangesAsync();
                return new ServiceResponse<bool>
                {
                    Data = true,
                    Message = "Updated image successfully!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
