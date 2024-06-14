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
        public async Task<ServiceResponse<bool>> CreatePost(AddPostDTO newPost)
        {
            var post = _mapper.Map<Post>(newPost);
            try
            {
                _context.Posts.Add(post);
                await _context.SaveChangesAsync();
                return new ServiceResponse<bool>
                {
                    Data = true,
                    Message = "Post created successfully!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<PagingParams<List<Post>>>> GetAdminPosts(int page)
        {
            var pageResults = 10f;
            var pageCount = Math.Ceiling(_context.Posts.Where(p => !p.Deleted).Count() / pageResults);
            try
            {
                var posts = await _context.Posts
                                   .Where(p => !p.Deleted)
                                   .OrderByDescending(p => p.ModifiedAt)
                                   .Skip((page - 1) * (int)pageResults)
                                   .Take((int)pageResults)
                                   .ToListAsync();

                var pagingData = new PagingParams<List<Post>>
                {
                    Result = posts,
                    CurrentPage = page,
                    Pages = (int)pageCount
                };

                return new ServiceResponse<PagingParams<List<Post>>>
                {
                    Data = pagingData,
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

        public async Task<ServiceResponse<PagingParams<List<CustomerPostReponseDTO>>>> GetPostsAsync(int page)
        {
            var pageResults = 10f;
            var pageCount = Math.Ceiling(_context.Posts.Where(p => !p.Deleted && p.IsActive).Count() / pageResults);
            try
            {
                var posts = await _context.Posts
                                   .Where(p => !p.Deleted && p.IsActive)
                                   .OrderByDescending(p => p.ModifiedAt)
                                   .Skip((page - 1) * (int)pageResults)
                                   .Take((int)pageResults)
                                   .ToListAsync();
                var result = _mapper.Map<List<CustomerPostReponseDTO>>(posts);

                var pagingData = new PagingParams<List<CustomerPostReponseDTO>>
                {
                    Result = result,
                    CurrentPage = page,
                    Pages = (int)pageCount
                };

                return new ServiceResponse<PagingParams<List<CustomerPostReponseDTO>>>
                {
                    Data = pagingData,
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<bool>> SoftDeletePost(Guid postId)
        {
            var post = await _context.Posts.FirstOrDefaultAsync(c => c.Id == postId);
            if (post == null)
            {
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = "Post not found"
                };
            }

            try
            {
                post.Deleted = true;
                await _context.SaveChangesAsync();

                return new ServiceResponse<bool>
                {
                    Data = true,
                    Message = "Post updated successfully!"
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<ServiceResponse<bool>> UpdatePost(Guid postId, UpdatePostDTO updatePost)
        {
            var dbPost = await _context.Posts.FirstOrDefaultAsync(c => c.Id == postId);
            if (dbPost == null)
            {
                return new ServiceResponse<bool>
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

                return new ServiceResponse<bool>
                {
                    Data = true,
                    Message = "Post deteted successfully!"
                };
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
    }
}
