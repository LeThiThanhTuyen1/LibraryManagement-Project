using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagementAPI.Models
{
    public class Book
    {
        [Key]
        public int book_id { get; set; }

        [Required(ErrorMessage = "Title is required.")]
        public string? title { get; set; }

        [Required(ErrorMessage = "ISBN is required.")]
        public string? isbn { get; set; }

        [Column("publisher_id")]
        public int? PublisherId { get; set; } // Nullable để có thể không cần Publisher

        [Range(1000, 3000, ErrorMessage = "Publication year must be between 1000 and 3000.")]
        public int? publication_year { get; set; } // Cho phép bỏ trống năm xuất bản

        public string? genre { get; set; } // Có thể bỏ trống

        public string? summary { get; set; } // Có thể bỏ trống

        public string? language { get; set; } // Có thể bỏ trống

        public string? file_path { get; set; } // Có thể bỏ trống

        public Publisher? Publisher { get; set; } // Cho phép null nếu không nhập Publisher

        public string? accessLevel { get; set; } // Có thể bỏ trống
    }
}
