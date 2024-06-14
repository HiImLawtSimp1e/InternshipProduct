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
        Task<ServiceResponse<PagingParams<List<Post>>>> GetAdminPosts(int page);
        Task<ServiceResponse<PagingParams<List<CustomerPostReponseDTO>>>> GetPostsAsync(int page);
        Task<ServiceResponse<Post>> GetAdminSinglePost(Guid id);
        Task<ServiceResponse<CustomerPostReponseDTO>> GetPostBySlug(string slug);
        Task<ServiceResponse<bool>> CreatePost(AddPostDTO newPost);
        Task<ServiceResponse<bool>> UpdatePost(Guid postId,UpdatePostDTO updatePost);
        Task<ServiceResponse<bool>> SoftDeletePost(Guid id);
    }
}
