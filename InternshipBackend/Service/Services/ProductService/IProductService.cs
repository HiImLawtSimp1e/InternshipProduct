using Data.Entities;
using Service.DTOs.RequestDTOs.ProductDTO;
using Service.DTOs.ResponseDTOs;
using Service.DTOs.ResponseDTOs.CustomerProductDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.ProductService
{
    public interface IProductService
    {
        Task<ServiceResponse<PagingParams<List<CustomerProductResponseDTO>>>> GetProductsAsync(int page, double pageResults);
        Task<ServiceResponse<PagingParams<List<Product>>>> GetAdminProducts(int page, double pageResults);
        Task<ServiceResponse<Product>> GetAdminSingleProduct(Guid id);
        Task<ServiceResponse<CustomerProductResponseDTO>> GetProductBySlug(string slug);
        Task<ServiceResponse<PagingParams<List<CustomerProductResponseDTO>>>> GetProductsByCategory(string categorySlug, int page, double pageResults);
        Task<ServiceResponse<bool>> CreateProduct(AddProductDTO newProduct);   
        Task<ServiceResponse<bool>> UpdateProduct(Guid id, UpdateProductDTO product);
        Task<ServiceResponse<bool>> SoftDeleteProduct(Guid productId);
        Task<ServiceResponse<PagingParams<List<CustomerProductResponseDTO>>>> SearchProducts(string searchText, int page, double pageResults);
        Task<ServiceResponse<List<string>>> GetProductSearchSuggestions(string seacrchText);
    }
}
