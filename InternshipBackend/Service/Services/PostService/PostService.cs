using AutoMapper;
using Data.Context;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Service.DTOs.RequestDTOs.PostDTO;
using Service.DTOs.ResponseDTOs.CustomerPostDTO;
using Service.DTOs.ResponseDTOs.CustomerProductDTO;
using Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Services.PostService
{
    public class PostService : IPostService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public PostService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<ServiceResponse<List<Post>>> CreatePost(AddPostDTO newPost)
        {
            var post = _mapper.Map<Post>(newPost);
            try
            {
                _context.Posts.Add(post);
                await _context.SaveChangesAsync();
                return await GetAdminPosts();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<List<Post>>> GetAdminPosts()
        {
            try
            {
                var posts = await _context.Posts
                                   .Where(p => !p.Deleted)
                                   .ToListAsync();
                return new ServiceResponse<List<Post>>
                {
                    Data = posts,
                    Message = "Successfully!"
                };
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<Post>> GetAdminSinglePost(Guid id)
        {
            try
            {
                var post = await _context.Posts
                                   .Where(p => !p.Deleted)
                                   .FirstOrDefaultAsync(p => p.Id == id);
                return new ServiceResponse<Post>
                {
                    Data = post,
                    Message = "Successfully!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<CustomerPostReponseDTO>> GetPostBySlug(string slug)
        {
            try
            {
                var post = await _context.Posts
                                   .Where(p => !p.Deleted && p.IsActive)
                                   .FirstOrDefaultAsync(p => p.Slug == slug);
                var result = _mapper.Map<CustomerPostReponseDTO>(post);
                return new ServiceResponse<CustomerPostReponseDTO>
                {
                    Data = result,
                    Message = "Successfully!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<List<CustomerPostReponseDTO>>> GetPostsAsync()
        {
            try
            {
                var posts = await _context.Posts
                                   .Where(p => !p.Deleted && p.IsActive)
                                   .ToListAsync();
                var result = _mapper.Map<List<CustomerPostReponseDTO>>(posts);
                return new ServiceResponse<List<CustomerPostReponseDTO>>
                {
                    Data = result,
                    Message = "Successfully!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<List<Post>>> SoftDeletePost(Guid postId)
        {
            var post = await _context.Posts.FirstOrDefaultAsync(c => c.Id == postId);
            if (post == null)
            {
                return new ServiceResponse<List<Post>>
                {
                    Success = false,
                    Message = "Post not found"
                };
            }

            try
            {
                post.Deleted = true;
                await _context.SaveChangesAsync();

                return await GetAdminPosts();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<List<Post>>> UpdatePost(UpdatePostDTO updatePost)
        {
            var dbPost = await _context.Posts.FirstOrDefaultAsync(c => c.Id == updatePost.Id);
            if (dbPost == null)
            {
                return new ServiceResponse<List<Post>>
                {
                    Success = false,
                    Message = "Post not found"
                };
            }
            try
            {
                _mapper.Map(updatePost, dbPost);
                dbPost.ModifiedAt = DateTime.Now;
                await _context.SaveChangesAsync();

                return await GetAdminPosts();
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
    }
}
