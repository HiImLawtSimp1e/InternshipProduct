using Data.Entities;
using Service.DTOs.RequestDTOs.ProductVariantDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.ProductVariantService
{
    public interface IProductVariantService
    {
        Task<ServiceResponse<bool>> AddVariant(Guid productId, AddProductVariantDTO newVariant);
        Task<ServiceResponse<bool>> UpdateVariant(Guid productId, UpdateProductVariantDTO updateVariant);
        Task<ServiceResponse<bool>> SoftDeleteVariant(Guid productTypeId, Guid productId);
        Task<ServiceResponse<ProductVariant>> GetVartiant(Guid productId, Guid productTypeId);
    }
}
