using Data.Entities;
using Service.DTOs.RequestDTOs.ProductImageDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.ProductImageService
{
    public interface IProductImageService
    {
        Task<ServiceResponse<ProductImage>> GetProductImage(Guid id);
        Task<ServiceResponse<bool>> CreateProductImage(AddProductImageDTO newImage);
        Task<ServiceResponse<bool>> UpdateProductImage(Guid id, UpdateProductImageDTO updateImage);
        Task<ServiceResponse<bool>> DeleteProductImage(Guid id);
    }
}
