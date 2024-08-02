using AutoMapper;
using Data.Entities;
using Service.DTOs.ResponseDTOs.CustomerVoucherDTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Profiles
{
    public class VoucherProfile : Profile
    {
        public VoucherProfile() 
        {
            //Map Entity to DTO
            CreateMap<Voucher, CustomerVoucherResponseDTO>();
        }
    }
}
