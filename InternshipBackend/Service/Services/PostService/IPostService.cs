using Data.Entities;
using Service.DTOs.RequestDTOs.PostDTO;
using Service.DTOs.ResponseDTOs.CustomerPostDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.PostService
{
    public interface IPostService
    {
        Task<ServiceResponse<List<Post>>> GetAdminPosts();
        Task<ServiceResponse<Post>> GetAdminSinglePost(Guid id);
        Task<ServiceResponse<List<CustomerPostReponseDTO>>> GetPostsAsync();
        Task<ServiceResponse<CustomerPostReponseDTO>> GetPostBySlug(string slug);
        Task<ServiceResponse<List<Post>>> CreatePost(AddPostDTO newPost);
        Task<ServiceResponse<List<Post>>> UpdatePost(UpdatePostDTO updatePost);
        Task<ServiceResponse<List<Post>>> SoftDeletePost(Guid id);
    }
}
