using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Service.DTOs.RequestDTOs.PostDTO
{
    public class UpdatePostDTO
    {
        [StringLength(100, ErrorMessage = "Title can't be longer than 100 characters")]
        public string Title { get; set; } = string.Empty;
        [StringLength(100, ErrorMessage = "Title can't be longer than 250 characters")]
        public string Slug { get; set; } = string.Empty;

        public string Image { get; set; } = string.Empty;
        [StringLength(250, ErrorMessage = "Description can't be longer than 250 characters")]
        public string Description { get; set; } = string.Empty;

        [AllowHtml]
        public string Content { get; set; } = string.Empty;

        [StringLength(70, ErrorMessage = "SEO Title can't be longer than 70 characters")]
        public string SeoTitle { get; set; } = string.Empty;

        [StringLength(160, ErrorMessage = "SEO Description can't be longer than 160 characters")]
        public string SeoDescription { get; set; } = string.Empty;

        [StringLength(100, ErrorMessage = "SEO Keywords can't be longer than 100 characters")]
        public string SeoKeyworks { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
