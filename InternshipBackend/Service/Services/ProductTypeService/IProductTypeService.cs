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
        Task<ServiceResponse<List<ProductType>>> GetProductTypes();
        Task<ServiceResponse<List<ProductType>>> CreateProductType(AddProductTypeDTO productType);
        Task<ServiceResponse<List<ProductType>>> UpdateProductType(UpdateProductTypeDTO productType);
        Task<ServiceResponse<List<ProductType>>> GetProductTypeSelect(Guid productId);
    }
}
