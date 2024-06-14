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
        [HttpGet("admin")]
        public async Task<ActionResult<ServiceResponse<PagingParams<List<Post>>>>> GetAdminPosts([FromQuery] int page)
        {
            if(page == null || page <= 0)
            {
                page = 1;
            }
            var response = await _service.GetAdminPosts(page);
            if(!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpGet("admin/{id}")]
        public async Task<ActionResult<ServiceResponse<Post>>> GetAdminPost(Guid id)
        {
            var response = await _service.GetAdminSinglePost(id);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpGet]
        public async Task<ActionResult<ServiceResponse<List<CustomerPostReponseDTO>>>> GetPostsAsync([FromQuery] int page)
        {
            if (page == null || page <= 0)
            {
                page = 1;
            }
            var response = await _service.GetPostsAsync(page);
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
        [HttpPost("admin")]
        public async Task<ActionResult<ServiceResponse<bool>>> CreatePost(AddPostDTO newPost) 
        {
            var response = await _service.CreatePost(newPost);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpPut("admin/{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> UpdatePost(Guid id,UpdatePostDTO updatePost)
        {
            var response = await _service.UpdatePost(id, updatePost);
            if (!response.Success)
            {
                return BadRequest(response);
            }
            return Ok(response);
        }
        [HttpDelete("admin/{id}")]
        public async Task<ActionResult<ServiceResponse<bool>>> SoftDeletePost(Guid id)
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
