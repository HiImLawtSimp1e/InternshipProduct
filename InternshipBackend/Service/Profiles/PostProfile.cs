using AutoMapper;
using Data.Entities;
using Service.DTOs.RequestDTOs.PostDTO;
using Service.DTOs.ResponseDTOs.CustomerPostDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Profiles
{
    public class PostProfile : Profile
    {
        public PostProfile() 
        {
            CreateMap<Post, CustomerPostReponseDTO>();
            CreateMap<AddPostDTO, Post>();
            CreateMap<UpdatePostDTO, Post>();
        }
    }
}
