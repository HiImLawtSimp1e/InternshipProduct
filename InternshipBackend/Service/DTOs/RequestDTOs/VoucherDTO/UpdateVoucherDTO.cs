using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Service.Models.Validation;

namespace Service.DTOs.RequestDTOs.VoucherDTO
{
    public class UpdateVoucherDTO
    {
        [Required(ErrorMessage = "Discount code is required")]
        [StringLength(25, MinimumLength = 2, ErrorMessage = "Discount code must be between 2 and 25 characters")]
        public string Code { get; set; } = string.Empty;
        [Required(ErrorMessage = "Voucher name is required")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Voucher name must be between 2 and 50 characters")]
        public string VoucherName { get; set; } = string.Empty;
        public bool IsDiscountPercent { get; set; } = false;
        [Required(ErrorMessage = "Discount value is required")]
        [Range(0.00, (double)decimal.MaxValue, ErrorMessage = "Discount value must be a non-negative decimal")]
        [Column(TypeName = "decimal(18,2)")]
        public double DiscountValue { get; set; } = 0.00;
        [Range(0, int.MaxValue, ErrorMessage = "Min order condition must be a non-negative integer")]
        public int MinOrderCondition { get; set; } = 0;
        [Range(0, int.MaxValue, ErrorMessage = "Max discount value value must be a non-negative integer")]
        public int MaxDiscountValue { get; set; } = 0;
        [Range(0, int.MaxValue, ErrorMessage = "Quantity must be a non-negative integer")]
        public int Quantity { get; set; } = 1000;
        public DateTime StartDate { get; set; } = DateTime.Now;
        [DateGreaterThan("StartDate", ErrorMessage = "End date must be after start date")]
        public DateTime EndDate { get; set; } = DateTime.Now.AddDays(30);
        public bool IsActive { get; set; } = true;
    }
}
