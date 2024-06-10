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
        Task<ServiceResponse<List<CustomerProductResponseDTO>>> GetProductsAsync();
        Task<ServiceResponse<List<Product>>> GetAdminProducts();
        Task<ServiceResponse<Product>> GetAdminSingleProduct(Guid id);
        Task<ServiceResponse<CustomerProductResponseDTO>> GetProductBySlug(string slug);
        Task<ServiceResponse<List<CustomerProductResponseDTO>>> GetProductsByCategory(string categorySlug);
        Task<ServiceResponse<List<Product>>> CreateProduct(AddProductDTO newProduct);   
        Task<ServiceResponse<bool>> UpdateProduct(Guid id, UpdateProductDTO product);
        Task<ServiceResponse<List<Product>>> SoftDeleteProduct(Guid productId);
        Task<ServiceResponse<ProductSearchResult>> SearchProducts(string searchText, int page);
        Task<ServiceResponse<List<string>>> GetProductSearchSuggestions(string seacrchText);
    }
}
