using Data.Entities;
using Service.DTOs.RequestDTOs.ProductAttributeDTO;
using Service.DTOs.RequestDTOs.ProductTypeDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.ProductAttributeService
{
    public interface IProductAttributeService
    {
        Task<ServiceResponse<PagingParams<List<ProductAttribute>>>> GetProductAttributes(int page);
        Task<ServiceResponse<ProductAttribute>> GetProductAttribute(Guid productAttributeId);
        Task<ServiceResponse<bool>> CreateProductAttribute(AddProductAttributeDTO newProductAttribute);
        Task<ServiceResponse<bool>> UpdateProductAttribute(Guid productAttributeId, UpdateProductAttributeDTO updateProductAttribute);
        Task<ServiceResponse<bool>> DeleteProductAttribute(Guid productAttributeId);
        Task<ServiceResponse<List<ProductAttribute>>> GetProductAttributeSelect(Guid productId);
    }
}
