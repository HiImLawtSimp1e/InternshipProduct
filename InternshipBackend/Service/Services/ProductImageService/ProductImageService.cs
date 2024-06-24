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

        public async Task<ServiceResponse<ProductImage>> GetProductImage(Guid id)
        {
            var productImage = await _context.ProductImages.FirstOrDefaultAsync(pi => pi.Id == id);
            return new ServiceResponse<ProductImage>
            {
                Data = productImage,
            };
        }

        public async Task<ServiceResponse<bool>> CreateProductImage(AddProductImageDTO newImage)
        {
            try
            {
                var image = _mapper.Map<ProductImage>(newImage);

                //Check if new main image
                //If new image is main image => set already main image in database is not main
                if (image.IsMain == true)
                {
                    var mainImage = _context.ProductImages
                                         .Where(pi => pi.ProductId == image.ProductId && !pi.Deleted)
                                         .FirstOrDefault(pi => pi.IsMain);
                    var dbProduct = await _context.Products
                                           .Where(p => !p.Deleted)
                                           .FirstOrDefaultAsync(p => p.Id == image.ProductId);

                    //if it has already main image in database => set that image is not main
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
            //If unactive image is main image => choose other image to main image
            if (updateImage.IsActive == false && dbImage.IsMain == true)
            {
                updateImage.IsMain = false;
                var someImageElse = await _context.ProductImages
                                      .Where(pi => pi.Id != dbImage.Id && !pi.Deleted && pi.IsActive)
                                      .FirstOrDefaultAsync(pi => pi.ProductId == dbImage.ProductId);
                var dbProduct = await _context.Products
                                         .Where(p => !p.Deleted)
                                         .FirstOrDefaultAsync(p => p.Id == dbImage.ProductId);

                // If this product has over 2 image => set random image to main image
                if (someImageElse != null && dbProduct != null)
                {
                    someImageElse.IsMain = true;
                    dbProduct.ImageUrl = someImageElse.ImageUrl;
                }
                else
                {
                    // If this product has only one image => deny that modify
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
                // If modified image is main image => check if database has already main image yet
                if (dbImage.IsMain == true)
                {
                    var mainImage = _context.ProductImages
                                         .Where(pi => pi.ProductId == dbImage.ProductId && !pi.Deleted)
                                         .FirstOrDefault(pi => pi.IsMain);
                    var dbProduct = await _context.Products
                                         .Where(p => !p.Deleted)
                                         .FirstOrDefaultAsync(p => p.Id == dbImage.ProductId);
                    // If it has already main image in database => set that image is not main 
                    if (mainImage != null && dbProduct !=null)
                    {
                        mainImage.IsMain = false;
                        dbProduct.ImageUrl = dbImage.ImageUrl;
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
