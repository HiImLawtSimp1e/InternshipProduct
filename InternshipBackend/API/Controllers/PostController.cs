using Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs.RequestDTOs.PostDTO;
using Service.DTOs.ResponseDTOs.CustomerPostDTO;
using Service.Models;
using Service.Services.PostService;
using System.Data;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly IPostService _service;

        public PostController(IPostService service)
        {
            _service = service;
        }
        [HttpGet("admin"), Authorize(Roles = "Admin")]
        public async Task<ActionResult<ServiceResponse<List<Post>>>> GetAdminPosts()
        {
            var response = await _service.GetAdminPosts();
            if(!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpGet("admin/{id}"), Authorize(Roles = "Admin")]
        public async Task<ActionResult<ServiceResponse<List<Post>>>> GetAdminPosts(Guid id)
        {
            var response = await _service.GetAdminSinglePost(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpGet]
        public async Task<ActionResult<ServiceResponse<List<CustomerPostReponseDTO>>>> GetPostsAsync()
        {
            var response = await _service.GetPostsAsync();
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpGet("{slug}")]
        public async Task<ActionResult<ServiceResponse<CustomerPostReponseDTO>>> GetPostsAsync(string slug)
        {
            var response = await _service.GetPostBySlug(slug);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpPost("admin"), Authorize(Roles = "Admin")]
        public async Task<ActionResult<ServiceResponse<List<Post>>>> CreatePost(AddPostDTO newPost) 
        {
            var response = await _service.CreatePost(newPost);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpPut("admin"), Authorize(Roles = "Admin")]
        public async Task<ActionResult<ServiceResponse<List<Post>>>> UpdatePost(UpdatePostDTO updatePost)
        {
            var response = await _service.UpdatePost(updatePost);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpDelete("admin/{id}"), Authorize(Roles = "Admin")]
        public async Task<ActionResult<ServiceResponse<List<Post>>>> SoftDeletePost(Guid id)
        {
            var response = await _service.SoftDeletePost(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
    }
}
