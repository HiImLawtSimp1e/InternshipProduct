using Data.Entities;
using Service.DTOs.RequestDTOs.ProductValueDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.ProductValueService
{
    public interface IProductValueService
    {
        Task<ServiceResponse<bool>> AddAttributeValue(Guid productId, AddProductValueDTO newAttributeValue);
        Task<ServiceResponse<bool>> UpdateAttributeValue(Guid productId, UpdateProductValueDTO updateAttributeValue);
        Task<ServiceResponse<bool>> SoftDeleteAttributeValue(Guid productId, Guid productAttributeId);
        Task<ServiceResponse<ProductValue>> GetAttributeValue(Guid productId, Guid productAttributeId);
    }
}
