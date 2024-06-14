using Data.Entities;
using Service.DTOs.RequestDTOs.ProductTypeDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.ProductTypeService
{
    public interface IProductTypeService
    {
        Task<ServiceResponse<PagingParams<List<ProductType>>>> GetProductTypes(int page);
        Task<ServiceResponse<ProductType>> GetProductType(Guid productTypeId);
        Task<ServiceResponse<bool>> CreateProductType(AddProductTypeDTO productType);
        Task<ServiceResponse<bool>> UpdateProductType(Guid productTypeId, UpdateProductTypeDTO productType);
        Task<ServiceResponse<bool>> DeleteProductType(Guid productTypeId);
        Task<ServiceResponse<List<ProductType>>> GetProductTypeSelect(Guid productId);
    }
}
