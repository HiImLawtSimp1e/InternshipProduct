using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.ResponseDTOs.CustomerVoucherDTO
{
    public class CustomerVoucherResponseDTO
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public string VoucherName { get; set; } = string.Empty;
        public bool IsDiscountPercent { get; set; } = false;
        [Column(TypeName = "decimal(5,2)")]

        public double DiscountValue { get; set; } = 0.00;
        public int MinOrderCondition { get; set; } = 0;
        public int MaxDiscountValue { get; set; } = 0;
    }
}
